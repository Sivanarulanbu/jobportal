from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'jobs', views.JobViewSet)
router.register(r'applications', views.ApplicationViewSet)
router.register(r'saved-jobs', views.SavedJobViewSet)
router.register(r'profile', views.UserProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', views.register, name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/me/', views.current_user, name='current_user'),
]
