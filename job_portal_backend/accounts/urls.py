from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserRegistrationViewSet, JobSeekerViewSet, EmployerViewSet,
    UserAccountHistoryViewSet, OTPViewSet
)

router = DefaultRouter()
router.register(r'auth', UserRegistrationViewSet, basename='auth')
router.register(r'otp', OTPViewSet, basename='otp')
router.register(r'job-seekers', JobSeekerViewSet, basename='job-seekers')
router.register(r'employers', EmployerViewSet, basename='employers')
router.register(r'account-history', UserAccountHistoryViewSet, basename='account-history')

app_name = 'accounts'

urlpatterns = [
    path('', include(router.urls)),
]
