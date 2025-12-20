from django.db import models
from django.contrib.auth.models import User
from django.core.validators import URLValidator
from django.utils import timezone

class JobSeeker(models.Model):
    """Model for job searchers/seekers"""
    EXPERIENCE_CHOICES = [
        ('fresher', 'Fresher'),
        ('junior', 'Junior (0-2 years)'),
        ('mid', 'Mid-level (2-5 years)'),
        ('senior', 'Senior (5-10 years)'),
        ('expert', 'Expert (10+ years)'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='job_seeker')
    
    # Profile Picture & Resume
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    
    # Basic Information
    phone = models.CharField(max_length=15, blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    
    # Professional Information
    headline = models.CharField(max_length=255, blank=True, null=True, help_text="Professional headline")
    bio = models.TextField(blank=True, null=True, help_text="About yourself")
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES, default='fresher')
    
    # Links
    portfolio_url = models.URLField(blank=True, null=True, validators=[URLValidator()])
    linkedin_url = models.URLField(blank=True, null=True, validators=[URLValidator()])
    github_url = models.URLField(blank=True, null=True, validators=[URLValidator()])
    
    # Skills (comma-separated or use a separate model for many-to-many)
    skills = models.TextField(blank=True, null=True, help_text="Comma-separated skills")
    
    # Preferences
    preferred_job_types = models.CharField(
        max_length=255, 
        blank=True, 
        null=True, 
        help_text="Comma-separated preferred job types: Full-time, Part-time, Contract, etc."
    )
    preferred_locations = models.CharField(
        max_length=255, 
        blank=True, 
        null=True, 
        help_text="Comma-separated preferred locations"
    )
    expected_salary = models.IntegerField(blank=True, null=True, help_text="Expected annual salary")
    
    # Status
    is_profile_complete = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_login = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Job Seeker"
        verbose_name_plural = "Job Seekers"
    
    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - Job Seeker"
    
    @property
    def get_skills_list(self):
        """Return skills as a list"""
        if self.skills:
            return [skill.strip() for skill in self.skills.split(',')]
        return []
    
    @property
    def get_preferred_job_types_list(self):
        """Return preferred job types as a list"""
        if self.preferred_job_types:
            return [jtype.strip() for jtype in self.preferred_job_types.split(',')]
        return []
    
    @property
    def profile_completion_percentage(self):
        """Calculate profile completion percentage"""
        fields_to_check = [
            'phone', 'date_of_birth', 'location', 'headline', 'bio',
            'portfolio_url', 'linkedin_url', 'github_url', 'skills',
            'preferred_job_types', 'preferred_locations', 'expected_salary'
        ]
        
        completed = sum(1 for field in fields_to_check if getattr(self, field))
        total = len(fields_to_check)
        
        return (completed / total) * 100 if total > 0 else 0


class Employer(models.Model):
    """Model for employers/recruiters"""
    COMPANY_SIZE_CHOICES = [
        ('startup', 'Startup (1-50)'),
        ('small', 'Small (51-200)'),
        ('medium', 'Medium (201-1000)'),
        ('large', 'Large (1000+)'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='employer')
    
    # Company Information
    company_name = models.CharField(max_length=255)
    company_size = models.CharField(max_length=20, choices=COMPANY_SIZE_CHOICES, default='startup')
    industry = models.CharField(max_length=255, blank=True, null=True)
    
    # Contact Information
    phone = models.CharField(max_length=15, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    
    # Links
    website_url = models.URLField(blank=True, null=True)
    linkedin_url = models.URLField(blank=True, null=True)
    
    # Description
    company_description = models.TextField(blank=True, null=True, help_text="About your company")
    
    # Status
    is_verified = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "Employer"
        verbose_name_plural = "Employers"
    
    def __str__(self):
        return f"{self.company_name} - {self.user.username}"


class UserAccountHistory(models.Model):
    """Track user account activities"""
    ACTION_CHOICES = [
        ('created', 'Account Created'),
        ('updated_profile', 'Profile Updated'),
        ('applied_job', 'Applied to Job'),
        ('saved_job', 'Saved Job'),
        ('logged_in', 'Logged In'),
        ('password_changed', 'Password Changed'),
        ('email_verified', 'Email Verified'),
        ('profile_completed', 'Profile Completed'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='account_history')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField(blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = "User Account History"
        verbose_name_plural = "User Account Histories"
    
    def __str__(self):
        return f"{self.user.username} - {self.action}"


class OTP(models.Model):
    """Model to store OTP for email verification and authentication"""
    email = models.EmailField()
    otp_code = models.CharField(max_length=6, unique=False)
    purpose = models.CharField(
        max_length=20,
        choices=[
            ('registration', 'Registration'),
            ('login', 'Login'),
            ('password_reset', 'Password Reset'),
        ],
        default='registration'
    )
    is_verified = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    
    class Meta:
        ordering = ['-created_at']
        unique_together = ['email', 'purpose']
    
    def __str__(self):
        return f"OTP for {self.email} ({self.purpose})"
    
    def is_expired(self):
        """Check if OTP has expired"""
        from django.utils import timezone
        return timezone.now() > self.expires_at
    
    def is_valid(self):
        """Check if OTP is valid (not expired and not verified)"""
        return not self.is_expired() and not self.is_verified and self.attempts < 5