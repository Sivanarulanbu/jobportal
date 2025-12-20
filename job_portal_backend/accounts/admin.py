from django.contrib import admin
from .models import JobSeeker, Employer, UserAccountHistory, OTP


@admin.register(JobSeeker)
class JobSeekerAdmin(admin.ModelAdmin):
    list_display = ['user', 'experience_level', 'is_profile_complete', 'created_at']
    list_filter = ['experience_level', 'is_profile_complete', 'is_active', 'created_at']
    search_fields = ['user__username', 'user__email', 'headline', 'skills']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Basic Information', {
            'fields': ('phone', 'date_of_birth', 'location')
        }),
        ('Professional Information', {
            'fields': ('headline', 'bio', 'experience_level', 'skills')
        }),
        ('Links & Portfolio', {
            'fields': ('portfolio_url', 'linkedin_url', 'github_url')
        }),
        ('Preferences', {
            'fields': ('preferred_job_types', 'preferred_locations', 'expected_salary')
        }),
        ('Status', {
            'fields': ('is_profile_complete', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at', 'last_login'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Employer)
class EmployerAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'user', 'is_verified', 'created_at']
    list_filter = ['is_verified', 'is_active', 'company_size', 'created_at']
    search_fields = ['company_name', 'user__username', 'user__email', 'industry']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Company Information', {
            'fields': ('company_name', 'company_size', 'industry', 'company_description')
        }),
        ('Contact Information', {
            'fields': ('phone', 'location')
        }),
        ('Links', {
            'fields': ('website_url', 'linkedin_url')
        }),
        ('Status', {
            'fields': ('is_verified', 'is_active')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(UserAccountHistory)
class UserAccountHistoryAdmin(admin.ModelAdmin):
    list_display = ['user', 'action', 'created_at', 'ip_address']
    list_filter = ['action', 'created_at']
    search_fields = ['user__username', 'user__email', 'description', 'ip_address']
    readonly_fields = ['created_at', 'user', 'action', 'description', 'ip_address', 'user_agent']
    
    def has_add_permission(self, request):
        # Prevent manual addition through admin
        return False
    
    def has_delete_permission(self, request, obj=None):
        # Prevent deletion of history records
        return False


@admin.register(OTP)
class OTPAdmin(admin.ModelAdmin):
    list_display = ['email', 'purpose', 'is_verified', 'attempts', 'created_at']
    list_filter = ['purpose', 'is_verified', 'created_at']
    search_fields = ['email']
    readonly_fields = ['created_at', 'otp_code']
    
    fieldsets = (
        ('OTP Information', {
            'fields': ('email', 'otp_code', 'purpose')
        }),
        ('Verification', {
            'fields': ('is_verified', 'attempts', 'created_at', 'expires_at')
        }),
    )
    
    def has_add_permission(self, request):
        return False
