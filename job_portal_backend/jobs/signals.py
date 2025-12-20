from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.contrib.auth.models import User
from jobs.models import UserProfile, Application, Job, SavedJob
import logging
import os
from email.mime.image import MIMEImage

logger = logging.getLogger(__name__)

import threading

def send_email_thread(subject, html_message, plain_message, recipient_list):
    """
    Worker function to send email in a separate thread
    """
    try:
        msg = EmailMultiAlternatives(subject, plain_message, settings.DEFAULT_FROM_EMAIL, recipient_list)
        msg.attach_alternative(html_message, "text/html")

        # Path to logo
        # Try development path first
        logo_path = os.path.join(settings.BASE_DIR, '..', 'job-portal-frontend', 'public', 'favicon_clean.png')
        
        # If not found (production/docker), try static root or build dir
        if not os.path.exists(logo_path):
            # Try collected static files (assuming runserver/gunicorn has run collectstatic)
            logo_path = os.path.join(settings.STATIC_ROOT, 'favicon_clean.png')
            
            if not os.path.exists(logo_path):
                 # Try directly in build/ which we copy to in Docker
                 logo_path = os.path.join(settings.BASE_DIR, 'build', 'favicon_clean.png')

        if os.path.exists(logo_path):
            with open(logo_path, 'rb') as f:
                logo_data = f.read()
            logo = MIMEImage(logo_data)
            logo.add_header('Content-ID', '<logo>')
            logo.add_header('Content-Disposition', 'inline', filename='logo.png')
            msg.attach(logo)
        else:
            logger.warning(f"⚠️ Logo not found at any checked path. Last checked: {logo_path}")

        msg.send()
        logger.info(f"✅ Email sent successfully to {recipient_list}")
        return True
    except Exception as e:
        logger.error(f"❌ Error in send_email_thread: {str(e)}")
        # raise e # Don't raise in thread, just log

def send_email_with_logo(subject, html_message, plain_message, recipient_list):
    """
    Helper function to trigger email sending in a background thread
    """
    email_thread = threading.Thread(
        target=send_email_thread,
        args=(subject, html_message, plain_message, recipient_list)
    )
    email_thread.daemon = True # Allow main program to exit even if thread is running
    email_thread.start()
    return True

# ==================== USER SIGNALS ====================

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal to create UserProfile when a new User is created
    """
    if created:
        try:
            UserProfile.objects.get_or_create(user=instance)
            logger.info(f"✅ UserProfile created for user: {instance.username}")
        except Exception as e:
            logger.error(f"❌ Error creating UserProfile for {instance.username}: {str(e)}")


@receiver(post_save, sender=User)
def send_welcome_email(sender, instance, created, **kwargs):
    """
    Signal to send welcome email when a new User is created
    """
    if created:
        send_employee_welcome_email(instance)


def send_employee_welcome_email(user):
    """
    Send welcome email to newly created user
    """
    try:
        profile = user.profile
        user_type_display = "Job Seeker" if profile.user_type == 'job_seeker' else "Employer"
        
        subject = f"Welcome to DreamRoute - {user_type_display}! 🎯"
        
        context = {
            'user_name': user.first_name or user.username,
            'username': user.username,
            'email': user.email,
            'user_type': user_type_display,
            'portal_url': settings.FRONTEND_URL,
            'dashboard_url': f'{settings.FRONTEND_URL}/jobs',
        }
        
        html_message = render_to_string('emails/welcome_email.html', context)
        plain_message = strip_tags(html_message)
        
        send_email_with_logo(subject, html_message, plain_message, [user.email])
        
        logger.info(f"✅ Welcome email sent to {user.email}")
        
    except Exception as e:
        logger.error(f"❌ Error sending welcome email to {user.email}: {str(e)}")


# ==================== USER PROFILE SIGNALS ====================

@receiver(post_save, sender=UserProfile)
def send_profile_completion_email(sender, instance, created, **kwargs):
    """
    Signal to send profile completion email when profile is marked as completed
    """
    if not created and instance.profile_completed:
        send_profile_email(instance.user)


def send_profile_email(user):
    """
    Send profile completion notification email
    """
    try:
        profile = user.profile
        user_type_display = "Job Seeker" if profile.user_type == 'job_seeker' else "Employer"
        
        subject = f"Profile Setup Complete - {user_type_display}! ✅"
        
        context = {
            'user_name': user.first_name or user.username,
            'user_type': user_type_display,
            'portal_url': settings.FRONTEND_URL,
            'profile_url': f'{settings.FRONTEND_URL}/profile',
        }
        
        html_message = render_to_string('emails/profile_email.html', context)
        plain_message = strip_tags(html_message)
        
        send_email_with_logo(subject, html_message, plain_message, [user.email])
        
        logger.info(f"✅ Profile completion email sent to {user.email}")
        
    except Exception as e:
        logger.error(f"❌ Error sending profile email to {user.email}: {str(e)}")


# ==================== JOB SIGNALS ====================

@receiver(post_save, sender=Job)
def send_job_posted_notification(sender, instance, created, **kwargs):
    """
    Signal to send notification email when employer posts a job
    """
    if created:
        send_job_posted_email(instance)


def send_job_posted_email(job):
    """
    Send job posted confirmation email to employer
    """
    try:
        subject = f"Job Posted Successfully: {job.title} - {job.company}"
        
        context = {
            'employer_name': job.employer.first_name or job.employer.username,
            'job_title': job.title,
            'company_name': job.company,
            'job_url': f'{settings.FRONTEND_URL}/jobs/{job.id}',
            'portal_url': settings.FRONTEND_URL,
        }
        
        html_message = render_to_string('emails/job_posted_email.html', context)
        plain_message = strip_tags(html_message)
        
        send_email_with_logo(subject, html_message, plain_message, [job.employer.email])
        
        logger.info(f"✅ Job posted email sent to {job.employer.email}")
        
    except Exception as e:
        logger.error(f"❌ Error sending job posted email: {str(e)}")


@receiver(pre_delete, sender=Job)
def send_job_deleted_notification(sender, instance, **kwargs):
    """
    Signal to send notification when job is deleted
    """
    try:
        subject = f"Job Deleted: {instance.title}"
        
        context = {
            'employer_name': instance.employer.first_name or instance.employer.username,
            'job_title': instance.title,
            'portal_url': settings.FRONTEND_URL,
        }
        
        html_message = render_to_string('emails/job_deleted_email.html', context)
        plain_message = strip_tags(html_message)
        
        send_email_with_logo(subject, html_message, plain_message, [instance.employer.email])
        
        logger.info(f"✅ Job deleted notification sent to {instance.employer.email}")
        
    except Exception as e:
        logger.error(f"❌ Error sending job deleted email: {str(e)}")


# ==================== APPLICATION SIGNALS ====================

@receiver(post_save, sender=Application)
def send_application_submitted_notification(sender, instance, created, **kwargs):
    """
    Signal to send notification email when user applies for a job
    """
    if created:
        send_application_submitted_email(instance)


def send_application_submitted_email(application):
    """
    Send application submitted confirmation email to applicant and notification to employer
    """
    try:
        # Email to applicant
        subject = f"Application Submitted for {application.job.title}"
        
        context = {
            'applicant_name': application.applicant.first_name or application.applicant.username,
            'job_title': application.job.title,
            'company_name': application.job.company,
            'portal_url': settings.FRONTEND_URL,
        }
        
        html_message = render_to_string('emails/application_submitted_email.html', context)
        plain_message = strip_tags(html_message)
        
        send_email_with_logo(subject, html_message, plain_message, [application.applicant.email])
        
        logger.info(f"✅ Application submitted email sent to {application.applicant.email}")
        
        # Email to employer
        employer_subject = f"New Application for {application.job.title}"
        
        employer_context = {
            'employer_name': application.job.employer.first_name or application.job.employer.username,
            'job_title': application.job.title,
            'applicant_name': application.applicant.get_full_name() or application.applicant.username,
            'applicant_email': application.applicant.email,
            'portal_url': settings.FRONTEND_URL,
        }
        
        employer_html_message = render_to_string('emails/new_application_email.html', employer_context)
        employer_plain_message = strip_tags(employer_html_message)
        
        send_email_with_logo(employer_subject, employer_html_message, employer_plain_message, [application.job.employer.email])
        
        logger.info(f"✅ New application notification sent to {application.job.employer.email}")
        
    except Exception as e:
        logger.error(f"❌ Error sending application email: {str(e)}")


@receiver(post_save, sender=Application)
def send_application_status_update(sender, instance, created, **kwargs):
    """
    Signal to send email when application status is updated
    """
    if not created:  # Only on updates, not on creation
        send_status_update_email(instance)


def send_status_update_email(application):
    """
    Send status update email to applicant
    """
    try:
        status_messages = {
            'pending': 'Your application is under review',
            'reviewed': 'Your application has been reviewed',
            'shortlisted': 'Congratulations! You have been shortlisted! 🎉',
            'rejected': 'Thank you for your interest',
            'accepted': 'Congratulations! You have been accepted! 🎉',
        }
        
        status_display = status_messages.get(application.status, application.status)
        subject = f"Application Status Update: {status_display}"
        
        context = {
            'applicant_name': application.applicant.first_name or application.applicant.username,
            'job_title': application.job.title,
            'company_name': application.job.company,
            'status': application.status.upper(),
            'status_message': status_display,
            'portal_url': settings.FRONTEND_URL,
        }
        
        html_message = render_to_string('emails/application_status_email.html', context)
        plain_message = strip_tags(html_message)
        
        send_email_with_logo(subject, html_message, plain_message, [application.applicant.email])
        
        logger.info(f"✅ Application status update sent to {application.applicant.email}")
        
    except Exception as e:
        logger.error(f"❌ Error sending application status email: {str(e)}")


# ==================== SAVED JOBS SIGNALS ====================

@receiver(post_save, sender=SavedJob)
def send_job_saved_notification(sender, instance, created, **kwargs):
    """
    Signal to send notification when user saves a job
    """
    if created:
        try:
            logger.info(f"✅ Job {instance.job.title} saved by {instance.user.username}")
        except Exception as e:
            logger.error(f"❌ Error logging saved job: {str(e)}")


@receiver(pre_delete, sender=SavedJob)
def send_job_unsaved_notification(sender, instance, **kwargs):
    """
    Signal to send notification when user removes a saved job
    """
    try:
        logger.info(f"✅ Job {instance.job.title} unsaved by {instance.user.username}")
    except Exception as e:
        logger.error(f"❌ Error logging unsaved job: {str(e)}")

