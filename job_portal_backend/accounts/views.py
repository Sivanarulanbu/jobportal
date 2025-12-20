from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
import logging

from .models import JobSeeker, Employer, UserAccountHistory
from .serializers import (
    UserSerializer, JobSeekerSerializer, EmployerSerializer,
    UserRegistrationSerializer, UserLoginSerializer, TokenSerializer,
    UserAccountHistorySerializer, SendOTPSerializer, VerifyOTPSerializer,
    OTPRegisterSerializer, OTPLoginSerializer
)
from .otp_service import create_otp, verify_otp

logger = logging.getLogger(__name__)


class UserRegistrationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for user registration and authentication.
    Handles both job seekers and employers.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        """
        Register a new user (job seeker or employer).
        
        Request body:
        {
            "username": "john_doe",
            "email": "john@example.com",
            "first_name": "John",
            "last_name": "Doe",
            "password": "SecurePass123",
            "password_confirm": "SecurePass123",
            "user_type": "job_seeker"  # or "employer"
        }
        """
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.save()
            
            # Set the user type for signal handling
            user._user_type = request.data.get('user_type', 'job_seeker')
            user.save()
            
            # Establish Django session
            login(request, user)
            
            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'success': True,
                'message': f"User registered successfully as {request.data.get('user_type')}",
                'user': UserSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        """
        Login user with username or email and establish Django session.
        
        Request body:
        {
            "username": "john_doe",  # or email
            "password": "SecurePass123"
        }
        """
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            username_or_email = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')
            
            logger.info(f"🔍 Login attempt for: {username_or_email}")
            
            # Try to find user by username first, then by email
            user = None
            if '@' in username_or_email:
                # Looks like an email
                try:
                    user_obj = User.objects.get(email=username_or_email)
                    logger.info(f"✅ Found user by email: {user_obj.username}")
                    user = authenticate(username=user_obj.username, password=password)
                    if user:
                        logger.info(f"✅ Authentication successful")
                    else:
                        logger.warning(f"❌ Authentication failed - wrong password")
                except User.DoesNotExist:
                    logger.warning(f"❌ No user found with email: {username_or_email}")
                except User.MultipleObjectsReturned:
                    logger.error(f"❌ Multiple users found with email: {username_or_email}")
            else:
                # Treat as username
                logger.info(f"🔍 Treating as username")
                user = authenticate(username=username_or_email, password=password)
                if user:
                    logger.info(f"✅ Authentication successful")
                else:
                    logger.warning(f"❌ Authentication failed")
            
            if user is not None:
                # Establish Django session
                login(request, user)
                
                # Log the login
                UserAccountHistory.objects.create(
                    user=user,
                    action='logged_in',
                    description='User logged in successfully'
                )
                
                # Generate JWT tokens
                refresh = RefreshToken.for_user(user)
                
                logger.info(f"✅ User logged in: {user.username} (email: {user.email})")
                
                return Response({
                    'success': True,
                    'message': 'Login successful',
                    'user': UserSerializer(user).data,
                    'tokens': {
                        'refresh': str(refresh),
                        'access': str(refresh.access_token),
                    }
                }, status=status.HTTP_200_OK)
            else:
                logger.warning(f"❌ Failed login attempt for: {username_or_email}")
                return Response({
                    'success': False,
                    'message': 'Invalid email or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """
        Logout user (clear Django session).
        """
        UserAccountHistory.objects.create(
            user=request.user,
            action='logged_out',
            description='User logged out'
        )
        
        logout(request)
        
        return Response({
            'success': True,
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def current_user(self, request):
        """
        Get current authenticated user details.
        """
        try:
            from jobs.models import UserProfile
            profile = request.user.profile
            user_type = profile.user_type
            
            return Response({
                'success': True,
                'user_type': user_type,
                'user': UserSerializer(request.user).data,
                'profile': {'id': profile.id, 'user_type': user_type}
            }, status=status.HTTP_200_OK)
        
        except (AttributeError, Exception) as e:
            logger.error(f"Error fetching current user: {str(e)}")
            return Response({
                'success': False,
                'message': 'User profile not found'
            }, status=status.HTTP_404_NOT_FOUND)


class JobSeekerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for JobSeeker profile management.
    """
    queryset = JobSeeker.objects.all()
    serializer_class = JobSeekerSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_profile(self, request):
        """
        Get current user's job seeker profile.
        """
        try:
            job_seeker = request.user.job_seeker
        except JobSeeker.DoesNotExist:
            # Self-healing: Create profile if missing
            job_seeker = JobSeeker.objects.create(user=request.user)
            print(f"✅ Auto-created missing JobSeeker profile for: {request.user.username}")

        serializer = self.get_serializer(job_seeker)
        return Response({
            'success': True,
            'profile': serializer.data
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['put'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        """
        Update current user's job seeker profile.
        """
        try:
            job_seeker = request.user.job_seeker
        except JobSeeker.DoesNotExist:
            # Self-healing: Create profile if missing
            job_seeker = JobSeeker.objects.create(user=request.user)
            print(f"✅ Auto-created missing JobSeeker profile for: {request.user.username}")

        serializer = self.get_serializer(job_seeker, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            # Log profile update
            UserAccountHistory.objects.create(
                user=request.user,
                action='updated_profile',
                description='JobSeeker profile updated'
            )
            
            logger.info(f"✅ Profile updated for user: {request.user.username}")
            
            return Response({
                'success': True,
                'message': 'Profile updated successfully',
                'profile': serializer.data
            }, status=status.HTTP_200_OK)
        
        print(f"❌ Serializer errors: {serializer.errors}")
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile_completion(self, request):
        """
        Get profile completion percentage and recommendations.
        """
        try:
            job_seeker = request.user.job_seeker
            completion = job_seeker.profile_completion_percentage
            
            missing_fields = []
            if not job_seeker.headline:
                missing_fields.append("Professional headline")
            if not job_seeker.bio:
                missing_fields.append("About section")
            if not job_seeker.skills:
                missing_fields.append("Skills")
            if not job_seeker.experience_level or job_seeker.experience_level == 'fresher':
                missing_fields.append("Experience level")
            if not job_seeker.portfolio_url:
                missing_fields.append("Portfolio URL")
            
            return Response({
                'success': True,
                'completion_percentage': round(completion, 2),
                'missing_fields': missing_fields,
                'is_profile_complete': job_seeker.is_profile_complete
            }, status=status.HTTP_200_OK)
        
        except JobSeeker.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Job seeker profile not found'
            }, status=status.HTTP_404_NOT_FOUND)


class EmployerViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Employer profile management.
    """
    queryset = Employer.objects.all()
    serializer_class = EmployerSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_profile(self, request):
        """
        Get current user's employer profile.
        """
        try:
            employer = request.user.employer
            serializer = self.get_serializer(employer)
            return Response({
                'success': True,
                'profile': serializer.data
            }, status=status.HTTP_200_OK)
        except Employer.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['put'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        """
        Update current user's employer profile.
        """
        try:
            employer = request.user.employer
            serializer = self.get_serializer(employer, data=request.data, partial=True)
            
            if serializer.is_valid():
                serializer.save()
                
                # Log profile update
                UserAccountHistory.objects.create(
                    user=request.user,
                    action='updated_profile',
                    description='Employer profile updated'
                )
                
                logger.info(f"✅ Employer profile updated for user: {request.user.username}")
                
                return Response({
                    'success': True,
                    'message': 'Profile updated successfully',
                    'profile': serializer.data
                }, status=status.HTTP_200_OK)
            
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Employer.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Employer profile not found'
            }, status=status.HTTP_404_NOT_FOUND)


class UserAccountHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing user account activity history.
    """
    serializer_class = UserAccountHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Return history only for the current user.
        """
        return UserAccountHistory.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_history(self, request):
        """
        Get current user's account activity history.
        """
        history = self.get_queryset()
        serializer = self.get_serializer(history, many=True)
        
        return Response({
            'success': True,
            'count': history.count(),
            'history': serializer.data
        }, status=status.HTTP_200_OK)


class OTPViewSet(viewsets.ViewSet):
    """ViewSet for OTP-based authentication"""
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'])
    def send_otp(self, request):
        """
        Send OTP to email
        
        Request body:
        {
            "email": "user@example.com",
            "purpose": "registration" | "login" | "password_reset"
        }
        """
        serializer = SendOTPSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            purpose = serializer.validated_data['purpose']
            
            try:
                otp = create_otp(email, purpose)
                return Response({
                    'success': True,
                    'message': f'OTP sent to {email}',
                    'email': email
                }, status=status.HTTP_200_OK)
            except Exception as e:
                logger.error(f"Error sending OTP: {e}")
                return Response({
                    'success': False,
                    'message': 'Failed to send OTP. Please try again.'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def verify_otp(self, request):
        """
        Verify OTP
        
        Request body:
        {
            "email": "user@example.com",
            "otp_code": "123456",
            "purpose": "registration" | "login" | "password_reset"
        }
        """
        serializer = VerifyOTPSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp_code']
            purpose = serializer.validated_data['purpose']
            
            is_valid, message = verify_otp(email, otp_code, purpose)
            
            if is_valid:
                return Response({
                    'success': True,
                    'message': message,
                    'email': email,
                    'purpose': purpose
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'message': message
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def register_with_otp(self, request):
        """
        Register with OTP verification
        
        Request body:
        {
            "username": "john_doe",
            "email": "john@example.com",
            "password": "SecurePass123",
            "password_confirm": "SecurePass123",
            "otp_code": "123456",
            "user_type": "job_seeker" | "employer",
            "first_name": "John",
            "last_name": "Doe"
        }
        """
        serializer = OTPRegisterSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                user = serializer.save()
                
                # Establish Django session
                login(request, user)
                
                return Response({
                    'success': True,
                    'message': 'Registration successful!',
                    'user': UserSerializer(user).data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                logger.error(f"Registration error: {e}")
                return Response({
                    'success': False,
                    'message': str(e)
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def login_with_otp(self, request):
        """
        Login with OTP verification
        
        Request body:
        {
            "email": "user@example.com",
            "otp_code": "123456"
        }
        """
        serializer = OTPLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp_code = serializer.validated_data['otp_code']
            
            # Verify OTP
            is_valid, message = verify_otp(email, otp_code, purpose='login')
            
            if not is_valid:
                return Response({
                    'success': False,
                    'message': message
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get user by email
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'User not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Establish Django session
            login(request, user)
            
            # Log the login
            UserAccountHistory.objects.create(
                user=user,
                action='logged_in',
                description='User logged in with OTP'
            )
            
            return Response({
                'success': True,
                'message': 'Login successful!',
                'user': UserSerializer(user).data
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)