from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, LoginView
from rest_framework.permissions import AllowAny

urlpatterns = [
    path('register/', RegisterView.as_view(permission_classes=[AllowAny]), name='register'),
    path('login/', LoginView.as_view(permission_classes=[AllowAny]), name='login'),
    # ...existing code...
]