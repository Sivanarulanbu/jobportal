from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.contrib.auth.models import User
from jobs.models import UserProfile

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal to create UserProfile when a new User is created
    """
    if created:
        UserProfile.objects.get_or_create(user=instance)


@receiver(post_save, sender=User)
def send_welcome_email(sender, instance, created, **kwargs):
    """
    Signal to send welcome email when a new User (Employee) is created
    """
    if created:
        send_employee_welcome_email(instance)


def send_employee_welcome_email(user):
    """
    Send welcome email to newly created employee
    """
    try:
        # Email subject
        subject = f"Welcome to Job Portal - {user.first_name or user.username}!"
        
        # Context for email template
        context = {
            'user_name': user.first_name or user.username,
            'username': user.username,
            'email': user.email,
            'portal_url': 'http://localhost:5173',
            'dashboard_url': 'http://localhost:5173/jobs',
        }
        
        # Render HTML email template
        html_message = render_to_string('emails/welcome_email.html', context)
        plain_message = strip_tags(html_message)
        
        # Send email
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        print(f"✅ Welcome email sent to {user.email}")
        
    except Exception as e:
        print(f"❌ Error sending welcome email to {user.email}: {str(e)}")


@receiver(post_save, sender=UserProfile)
def send_profile_completion_email(sender, instance, created, **kwargs):
    """
    Signal to send profile completion email
    """
    if not created and instance.profile_completed:
        send_profile_email(instance.user)


def send_profile_email(user):
    """
    Send profile completion notification email
    """
    try:
        subject = f"Profile Setup Complete - {user.first_name or user.username}!"
        
        context = {
            'user_name': user.first_name or user.username,
            'portal_url': 'http://localhost:5173',
            'profile_url': 'http://localhost:5173/profile',
        }
        
        html_message = render_to_string('emails/profile_email.html', context)
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=html_message,
            fail_silently=False,
        )
        
        print(f"✅ Profile email sent to {user.email}")
        
    except Exception as e:
        print(f"❌ Error sending profile email to {user.email}: {str(e)}")
