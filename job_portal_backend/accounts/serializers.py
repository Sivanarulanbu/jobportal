from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import JobSeeker, Employer, UserAccountHistory


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class JobSeekerSerializer(serializers.ModelSerializer):
    """Serializer for JobSeeker model"""
    user = UserSerializer(read_only=True)
    skills_list = serializers.SerializerMethodField()
    profile_completion = serializers.SerializerMethodField()
    
    class Meta:
        model = JobSeeker
        fields = [
            'id', 'user', 'phone', 'date_of_birth', 'location', 'headline', 'bio',
            'experience_level', 'portfolio_url', 'linkedin_url', 'github_url',
            'skills', 'skills_list', 'preferred_job_types', 'preferred_locations',
            'expected_salary', 'is_profile_complete', 'is_active', 'created_at',
            'updated_at', 'profile_completion'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def get_skills_list(self, obj):
        return obj.get_skills_list
    
    def get_profile_completion(self, obj):
        return round(obj.profile_completion_percentage, 2)


class EmployerSerializer(serializers.ModelSerializer):
    """Serializer for Employer model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Employer
        fields = [
            'id', 'user', 'company_name', 'company_size', 'industry', 'phone',
            'location', 'website_url', 'linkedin_url', 'company_description',
            'is_verified', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'is_verified', 'created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    email = serializers.EmailField(required=True)
    user_type = serializers.ChoiceField(choices=['job_seeker', 'employer'])
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password_confirm', 'user_type']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already in use."})
        
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "Username already taken."})
        
        return data
    
    def create(self, validated_data):
        user_type = validated_data.pop('user_type')
        validated_data.pop('password_confirm')
        
        user = User.objects.create_user(**validated_data)
        
        # Create associated profile based on user_type
        if user_type == 'job_seeker':
            JobSeeker.objects.create(user=user)
        elif user_type == 'employer':
            Employer.objects.create(user=user, company_name=user.username)
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            raise serializers.ValidationError("Both username and password are required.")
        
        return data


class UserAccountHistorySerializer(serializers.ModelSerializer):
    """Serializer for UserAccountHistory model"""
    user_info = serializers.SerializerMethodField()
    
    class Meta:
        model = UserAccountHistory
        fields = ['id', 'user', 'user_info', 'action', 'description', 'ip_address', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
    
    def get_user_info(self, obj):
        return f"{obj.user.username} ({obj.user.email})"


class TokenSerializer(serializers.Serializer):
    """Serializer for JWT tokens"""
    refresh = serializers.CharField()
    access = serializers.CharField()
