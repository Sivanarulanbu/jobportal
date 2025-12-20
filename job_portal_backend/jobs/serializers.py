from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import UserProfile, Job, Application, SavedJob

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = '__all__'

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    user_type = serializers.ChoiceField(choices=UserProfile.USER_TYPE_CHOICES, default='job_seeker')
    access = serializers.SerializerMethodField()
    refresh = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name', 'user_type', 'access', 'refresh']
        read_only_fields = ['access', 'refresh']
    
    def validate(self, data):
        if data.get('password') != data.get('password_confirm'):
            raise serializers.ValidationError({'password': 'Passwords do not match'})
        return data
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value
    
    def create(self, validated_data):
        user_type = validated_data.pop('user_type', 'job_seeker')
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        UserProfile.objects.create(user=user, user_type=user_type)
        return user
    
    def get_access(self, obj):
        if not hasattr(self, '_refresh_token'):
            self._refresh_token = RefreshToken.for_user(obj)
        return str(self._refresh_token.access_token)
    
    def get_refresh(self, obj):
        if not hasattr(self, '_refresh_token'):
            self._refresh_token = RefreshToken.for_user(obj)
        return str(self._refresh_token)

class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.username', read_only=True)
    applications_count = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()
    is_applied = serializers.SerializerMethodField()
    
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['employer']
    
    def get_applications_count(self, obj):
        return obj.applications.count()

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False

    def get_is_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Application.objects.filter(applicant=request.user, job=obj).exists()
        return False

class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    applicant_name = serializers.CharField(source='applicant.get_full_name', read_only=True)
    applicant_email = serializers.CharField(source='applicant.email', read_only=True)
    resume = serializers.FileField(required=False, allow_null=True)
    cover_letter = serializers.CharField(required=False, allow_blank=True, default='')
    
    applicant_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = ['id', 'job_title', 'applicant_name', 'applicant_email', 'cover_letter', 'resume', 'status', 'applied_at', 'updated_at', 'applicant_details']
        read_only_fields = ['status', 'applied_at', 'updated_at', 'job_title', 'applicant_name', 'applicant_email']

    def get_applicant_details(self, obj):
        try:
            # Access the pre-fetched job_seeker relationship if available
            # validation is handled by the try/except block as accessing a missing 
            # reverse OneToOne relation raises an ObjectDoesNotExist (AttributeError in some contexts or RelatedObjectDoesNotExist)
            job_seeker = obj.applicant.job_seeker
            
            request = self.context.get('request')
            
            profile_resume_url = None
            if job_seeker.resume:
                profile_resume_url = request.build_absolute_uri(job_seeker.resume.url) if request else job_seeker.resume.url

            profile_picture_url = None
            if job_seeker.profile_picture:
                profile_picture_url = request.build_absolute_uri(job_seeker.profile_picture.url) if request else job_seeker.profile_picture.url

            return {
                'id': job_seeker.id,
                'phone': job_seeker.phone,
                'location': job_seeker.location,
                'bio': job_seeker.bio,
                'headline': job_seeker.headline,
                'experience_level': job_seeker.experience_level,
                'skills': job_seeker.get_skills_list,
                'portfolio_url': job_seeker.portfolio_url,
                'linkedin_url': job_seeker.linkedin_url,
                'github_url': job_seeker.github_url,
                'profile_resume_url': profile_resume_url,
                'profile_picture_url': profile_picture_url,
            }
        except Exception as e:
            # Fallback if JobSeeker profile doesn't exist
            # print(f"Error fetching applicant details: {e}") 
            return None


class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    
    class Meta:
        model = SavedJob
        fields = '__all__'
        read_only_fields = ['user']