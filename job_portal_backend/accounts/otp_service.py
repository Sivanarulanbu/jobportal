"""OTP generation and verification utilities"""
import random
import string
from django.utils import timezone
from datetime import timedelta
from .models import OTP

def generate_otp(length=6):
    """Generate a random OTP code"""
    return ''.join(random.choices(string.digits, k=length))

def send_otp_email(email, otp_code, purpose='registration'):
    """Send OTP via email"""
    from django.core.mail import send_mail
    from django.conf import settings
    
    subject_map = {
        'registration': 'Verify Your Email - Job Portal',
        'login': 'Login Verification - Job Portal',
        'password_reset': 'Reset Your Password - Job Portal'
    }
    
    message_map = {
        'registration': f'Your registration verification code is: {otp_code}\n\nThis code will expire in 10 minutes.',
        'login': f'Your login verification code is: {otp_code}\n\nThis code will expire in 10 minutes.',
        'password_reset': f'Your password reset verification code is: {otp_code}\n\nThis code will expire in 10 minutes.'
    }
    
    try:
        send_mail(
            subject=subject_map.get(purpose, 'Verify Your Identity'),
            message=message_map.get(purpose, f'Your verification code is: {otp_code}'),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending OTP email: {e}")
        return False

def create_otp(email, purpose='registration'):
    """Create or update OTP for given email and purpose"""
    otp_code = generate_otp()
    expires_at = timezone.now() + timedelta(minutes=10)
    
    # Delete existing OTP for this email/purpose if it exists
    OTP.objects.filter(email=email, purpose=purpose).delete()
    
    otp = OTP.objects.create(
        email=email,
        otp_code=otp_code,
        purpose=purpose,
        expires_at=expires_at
    )
    
    # Send OTP via email
    send_otp_email(email, otp_code, purpose)
    
    return otp

def verify_otp(email, otp_code, purpose='registration'):
    """Verify OTP for given email and purpose"""
    try:
        otp = OTP.objects.get(email=email, purpose=purpose)
    except OTP.DoesNotExist:
        return False, "OTP not found"
    
    # Check if OTP is expired
    if otp.is_expired():
        return False, "OTP has expired"
    
    # Check attempt limit
    if otp.attempts >= 5:
        return False, "Too many incorrect attempts"
    
    # Check if OTP code matches
    if otp.otp_code != otp_code:
        otp.attempts += 1
        otp.save()
        return False, f"Invalid OTP. {5 - otp.attempts} attempts remaining"
    
    # Mark as verified
    otp.is_verified = True
    otp.save()
    
    return True, "OTP verified successfully"

def cleanup_expired_otps():
    """Delete expired OTPs (scheduled task)"""
    from django.utils import timezone
    OTP.objects.filter(expires_at__lt=timezone.now()).delete()
