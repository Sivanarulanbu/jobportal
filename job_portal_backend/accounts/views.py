from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
import logging

from .models import JobSeeker, Employer, UserAccountHistory
from .serializers import (
    UserSerializer, JobSeekerSerializer, EmployerSerializer,
    UserRegistrationSerializer, UserLoginSerializer, TokenSerializer,
    UserAccountHistorySerializer
)

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
            
            # Generate tokens
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
        Login user and return JWT tokens.
        
        Request body:
        {
            "username": "john_doe",
            "password": "SecurePass123"
        }
        """
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')
            
            user = authenticate(username=username, password=password)
            
            if user is not None:
                refresh = RefreshToken.for_user(user)
                
                # Log the login
                UserAccountHistory.objects.create(
                    user=user,
                    action='logged_in',
                    description='User logged in successfully'
                )
                
                logger.info(f"✅ User logged in: {username}")
                
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
                logger.warning(f"❌ Failed login attempt for username: {username}")
                return Response({
                    'success': False,
                    'message': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        """
        Logout user (token-based, so just return success).
        JWT token should be blacklisted on frontend.
        """
        UserAccountHistory.objects.create(
            user=request.user,
            action='logged_in',
            description='User logged out'
        )
        
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
            # Check if user is a job seeker
            if hasattr(request.user, 'job_seeker'):
                return Response({
                    'success': True,
                    'user_type': 'job_seeker',
                    'user': UserSerializer(request.user).data,
                    'profile': JobSeekerSerializer(request.user.job_seeker).data
                }, status=status.HTTP_200_OK)
            
            # Check if user is an employer
            elif hasattr(request.user, 'employer'):
                return Response({
                    'success': True,
                    'user_type': 'employer',
                    'user': UserSerializer(request.user).data,
                    'profile': EmployerSerializer(request.user.employer).data
                }, status=status.HTTP_200_OK)
            
            else:
                return Response({
                    'success': False,
                    'message': 'User profile not found'
                }, status=status.HTTP_404_NOT_FOUND)
        
        except Exception as e:
            logger.error(f"❌ Error fetching current user: {str(e)}")
            return Response({
                'success': False,
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            serializer = self.get_serializer(job_seeker)
            return Response({
                'success': True,
                'profile': serializer.data
            }, status=status.HTTP_200_OK)
        except JobSeeker.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Job seeker profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=False, methods=['put'], permission_classes=[IsAuthenticated])
    def update_profile(self, request):
        """
        Update current user's job seeker profile.
        """
        try:
            job_seeker = request.user.job_seeker
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
            
            return Response({
                'success': False,
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except JobSeeker.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Job seeker profile not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
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
