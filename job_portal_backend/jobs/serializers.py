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
    
    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ['employer']
    
    def get_applications_count(self, obj):
        return obj.applications.count()

class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    applicant_name = serializers.CharField(source='applicant.get_full_name', read_only=True)
    applicant_email = serializers.CharField(source='applicant.email', read_only=True)
    resume = serializers.FileField(required=False, allow_null=True)
    
    class Meta:
        model = Application
        fields = ['id', 'job', 'job_title', 'applicant', 'applicant_name', 'applicant_email', 'cover_letter', 'resume', 'status', 'applied_at', 'updated_at']
        read_only_fields = ['applicant', 'status', 'applied_at', 'updated_at', 'job_title', 'applicant_name', 'applicant_email']

class SavedJobSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)
    
    class Meta:
        model = SavedJob
        fields = '__all__'
        read_only_fields = ['user']