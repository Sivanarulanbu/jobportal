from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db.models import Q
from django.contrib.auth import authenticate
from .models import UserProfile, Job, Application, SavedJob
from .serializers import (
    UserSerializer, UserProfileSerializer, RegisterSerializer,
    JobSerializer, ApplicationSerializer, SavedJobSerializer
)

class AuthViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_200_OK)
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        try:
            profile = request.user.userprofile
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(user=request.user)
        
        return Response({
            'user': UserSerializer(request.user).data,
            'profile': UserProfileSerializer(profile).data
        })

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.filter(is_active=True)
    serializer_class = JobSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'company', 'location', 'skills', 'description']
    ordering_fields = ['created_at', 'salary_min']
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def perform_create(self, serializer):
        # Check if user can post jobs (must be employer)
        user = self.request.user
        
        try:
            profile = user.profile
            if profile.user_type != 'employer':
                from rest_framework.exceptions import PermissionDenied
                raise PermissionDenied("Only employers can post jobs")
        except (AttributeError, UserProfile.DoesNotExist):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("User profile not found")
        
        serializer.save(employer=user)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by job_type
        job_type = self.request.query_params.get('job_type')
        if job_type:
            queryset = queryset.filter(job_type=job_type)
        
        # Filter by location
        location = self.request.query_params.get('location')
        if location:
            queryset = queryset.filter(location__icontains=location)
        
        # Filter by experience_required
        experience = self.request.query_params.get('experience_required')
        if experience:
            queryset = queryset.filter(experience_required=experience)
        
        # Filter by salary range
        salary_min = self.request.query_params.get('salary_min')
        salary_max = self.request.query_params.get('salary_max')
        if salary_min:
            queryset = queryset.filter(salary_min__gte=salary_min)
        if salary_max:
            queryset = queryset.filter(salary_max__lte=salary_max)
        
        # Filter by company
        company = self.request.query_params.get('company')
        if company:
            queryset = queryset.filter(company__icontains=company)
        
        # Filter by skills (any skill match)
        skills = self.request.query_params.get('skills')
        if skills:
            for skill in skills.split(','):
                queryset = queryset.filter(skills__icontains=skill.strip())
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def my_jobs(self, request):
        jobs = Job.objects.filter(employer=request.user)
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        job = self.get_object()
        
        if Application.objects.filter(job=job, applicant=request.user).exists():
            return Response({'detail': 'You have already applied for this job.'}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(job=job, applicant=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def save(self, request, pk=None):
        job = self.get_object()
        user = request.user
        
        try:
            saved_job = SavedJob.objects.get(user=user, job=job)
            saved_job.delete()
            return Response({'status': 'unsaved', 'is_saved': False}, status=status.HTTP_200_OK)
        except SavedJob.DoesNotExist:
            SavedJob.objects.create(user=user, job=job)
            return Response({'status': 'saved', 'is_saved': True}, status=status.HTTP_201_CREATED)

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.profile.user_type == 'employer':
            return Application.objects.filter(job__employer=user).select_related(
                'job', 
                'applicant', 
                'applicant__job_seeker'
            )
        return Application.objects.filter(applicant=user).select_related('job')
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        application = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in dict(Application.STATUS_CHOICES):
            application.status = new_status
            application.save()
            return Response(ApplicationSerializer(application).data)
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

class SavedJobViewSet(viewsets.ModelViewSet):
    queryset = SavedJob.objects.all()
    serializer_class = SavedJobSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        job_id = self.request.data.get('job')
        job = Job.objects.get(id=job_id)
        serializer.save(user=self.request.user, job=job)

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return UserProfile.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def me(self, request):
        profile = request.user.profile
        if request.method == 'GET':
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        else:
            serializer = self.get_serializer(profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)