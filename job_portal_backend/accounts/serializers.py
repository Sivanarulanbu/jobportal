from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import JobSeeker, Employer, UserAccountHistory
try:
    from jobs.models import UserProfile
except ImportError:
    UserProfile = None


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    profile = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'date_joined', 'profile']
        read_only_fields = ['id', 'date_joined']
    
    def get_profile(self, obj):
        """Include profile data with user_type for role-based access"""
        try:
            from jobs.models import UserProfile
            profile = obj.profile
            return {'id': profile.id, 'user_type': profile.user_type}
        except:
            return None


class JobSeekerSerializer(serializers.ModelSerializer):
    """Serializer for JobSeeker model"""
    user = UserSerializer(read_only=True)
    skills_list = serializers.SerializerMethodField()
    profile_completion = serializers.SerializerMethodField()
    
    class Meta:
        model = JobSeeker
        fields = [
            'id', 'user', 'profile_picture', 'resume', 'phone', 'date_of_birth', 'location', 'headline', 'bio',
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
        
        # Create UserProfile in jobs app with user_type
        if UserProfile:
            try:
                profile, created = UserProfile.objects.get_or_create(
                    user=user,
                    defaults={'user_type': user_type}
                )
                if not created:
                    profile.user_type = user_type
                    profile.save()
            except Exception as e:
                print(f"Error creating UserProfile: {e}")
                raise
        
        # Create the appropriate profile based on user_type
        if user_type == 'job_seeker':
            try:
                JobSeeker.objects.create(user=user)
                print(f"✅ JobSeeker profile created for user: {user.username}")
            except Exception as e:
                print(f"Error creating JobSeeker profile: {e}")
        elif user_type == 'employer':
            try:
                Employer.objects.create(user=user, company_name=user.username)
                print(f"✅ Employer profile created for user: {user.username}")
            except Exception as e:
                print(f"Error creating Employer profile: {e}")
        
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


class SendOTPSerializer(serializers.Serializer):
    """Serializer for sending OTP"""
    email = serializers.EmailField()
    purpose = serializers.ChoiceField(choices=['registration', 'login', 'password_reset'], default='registration')


class VerifyOTPSerializer(serializers.Serializer):
    """Serializer for verifying OTP"""
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)
    purpose = serializers.ChoiceField(choices=['registration', 'login', 'password_reset'], default='registration')


class OTPRegisterSerializer(serializers.ModelSerializer):
    """Serializer for OTP-based registration"""
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True, min_length=8)
    otp_code = serializers.CharField(max_length=6, write_only=True)
    user_type = serializers.ChoiceField(choices=['job_seeker', 'employer'])
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'otp_code', 'user_type', 'first_name', 'last_name']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Email already in use."})
        
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({"username": "Username already taken."})
        
        return data
    
        return user
        
    def create(self, validated_data):
        from .otp_service import verify_otp
        
        # Verify OTP
        email = validated_data['email']
        otp_code = validated_data.pop('otp_code')
        user_type = validated_data.pop('user_type')
        
        is_valid, message = verify_otp(email, otp_code, purpose='registration')
        if not is_valid:
            raise serializers.ValidationError({"otp_code": message})
        
        # Create user
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        
        # Create UserProfile in jobs app with user_type
        if UserProfile:
            try:
                profile, created = UserProfile.objects.get_or_create(
                    user=user,
                    defaults={'user_type': user_type}
                )
                if not created:
                    profile.user_type = user_type
                    profile.save()
            except Exception as e:
                print(f"Error creating UserProfile: {e}")
        
        # Create the appropriate profile based on user_type
        if user_type == 'job_seeker':
            try:
                JobSeeker.objects.create(user=user)
                print(f"✅ JobSeeker profile created for user: {user.username}")
            except Exception as e:
                print(f"Error creating JobSeeker profile: {e}")
        elif user_type == 'employer':
            try:
                Employer.objects.create(user=user, company_name=user.username)
                print(f"✅ Employer profile created for user: {user.username}")
            except Exception as e:
                print(f"Error creating Employer profile: {e}")
        
        return user


class OTPLoginSerializer(serializers.Serializer):
    """Serializer for OTP-based login"""
    email = serializers.EmailField()
    otp_code = serializers.CharField(max_length=6)
