from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
import logging

from .models import JobSeeker, Employer, UserAccountHistory

logger = logging.getLogger(__name__)


# ==================== JobSeeker Signals ====================

@receiver(post_save, sender=User)
def create_job_seeker_profile(sender, instance, created, **kwargs):
    """
    Automatically create JobSeeker profile when a new user registers as job_seeker.
    This signal is triggered when a User is created through registration.
    """
    if created:
        # Check if this is a job seeker registration
        # This will be set from the registration view
        if hasattr(instance, '_user_type') and instance._user_type == 'job_seeker':
            try:
                JobSeeker.objects.create(user=instance)
                logger.info(f"✅ JobSeeker profile created for user: {instance.username}")
                
                # Log the account creation
                UserAccountHistory.objects.create(
                    user=instance,
                    action='created',
                    description=f'New JobSeeker account created'
                )
            except Exception as e:
                logger.error(f"❌ Error creating JobSeeker profile: {str(e)}")


@receiver(post_save, sender=JobSeeker)
def send_job_seeker_welcome_email(sender, instance, created, **kwargs):
    """
    Send welcome email to new job seekers with tips and next steps.
    """
    if created:
        try:
            user = instance.user
            subject = f"Welcome to Job Portal, {user.first_name or user.username}!"
            
            context = {
                'user_name': user.first_name or user.username,
                'email': user.email,
                'username': user.username,
                'portal_url': 'http://localhost:5173',
                'jobs_url': 'http://localhost:5173/jobs',
                'profile_url': 'http://localhost:5173/profile',
            }
            
            html_message = render_to_string('emails/job_seeker_welcome.html', context)
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"✅ Welcome email sent to job seeker: {user.email}")
        except Exception as e:
            logger.error(f"❌ Error sending job seeker welcome email: {str(e)}")


@receiver(pre_save, sender=JobSeeker)
def track_profile_completion(sender, instance, **kwargs):
    """
    Track when job seeker completes their profile and send celebration email.
    """
    if instance.pk:  # Only for updates, not creation
        try:
            previous = JobSeeker.objects.get(pk=instance.pk)
            
            # If profile wasn't complete but now is
            if not previous.is_profile_complete and instance.is_profile_complete:
                instance._profile_just_completed = True
        except JobSeeker.DoesNotExist:
            pass


@receiver(post_save, sender=JobSeeker)
def send_profile_completion_email(sender, instance, **kwargs):
    """
    Send congratulations email when job seeker completes their profile.
    """
    if hasattr(instance, '_profile_just_completed') and instance._profile_just_completed:
        try:
            user = instance.user
            subject = f"Profile Complete! You're Ready to Land Your Dream Job!"
            
            context = {
                'user_name': user.first_name or user.username,
                'profile_url': 'http://localhost:5173/profile',
                'jobs_url': 'http://localhost:5173/jobs',
                'portal_url': 'http://localhost:5173',
            }
            
            html_message = render_to_string('emails/job_seeker_profile_complete.html', context)
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"✅ Profile completion email sent to: {user.email}")
            
            # Log the action
            UserAccountHistory.objects.create(
                user=user,
                action='profile_completed',
                description='JobSeeker profile marked as complete'
            )
        except Exception as e:
            logger.error(f"❌ Error sending profile completion email: {str(e)}")


# ==================== Employer Signals ====================

@receiver(post_save, sender=User)
def create_employer_profile(sender, instance, created, **kwargs):
    """
    Automatically create Employer profile when a new user registers as employer.
    """
    if created:
        if hasattr(instance, '_user_type') and instance._user_type == 'employer':
            try:
                Employer.objects.create(
                    user=instance,
                    company_name=instance.username
                )
                logger.info(f"✅ Employer profile created for user: {instance.username}")
                
                # Log the account creation
                UserAccountHistory.objects.create(
                    user=instance,
                    action='created',
                    description=f'New Employer account created'
                )
            except Exception as e:
                logger.error(f"❌ Error creating Employer profile: {str(e)}")


@receiver(post_save, sender=Employer)
def send_employer_welcome_email(sender, instance, created, **kwargs):
    """
    Send welcome email to new employers with onboarding information.
    """
    if created:
        try:
            user = instance.user
            subject = f"Welcome to Job Portal Employer Dashboard!"
            
            context = {
                'company_name': instance.company_name,
                'user_name': user.first_name or user.username,
                'email': user.email,
                'portal_url': 'http://localhost:5173',
                'dashboard_url': 'http://localhost:5173/employer/dashboard',
            }
            
            html_message = render_to_string('emails/employer_welcome.html', context)
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"✅ Welcome email sent to employer: {user.email}")
        except Exception as e:
            logger.error(f"❌ Error sending employer welcome email: {str(e)}")


# ==================== User Activity Tracking ====================

@receiver(post_save, sender=User)
def log_user_login(sender, instance, **kwargs):
    """
    Log user login activity (can be triggered from login view).
    """
    if hasattr(instance, '_just_logged_in') and instance._just_logged_in:
        try:
            UserAccountHistory.objects.create(
                user=instance,
                action='logged_in',
                description='User logged in'
            )
            logger.info(f"✅ Login logged for user: {instance.username}")
        except Exception as e:
            logger.error(f"❌ Error logging login activity: {str(e)}")
