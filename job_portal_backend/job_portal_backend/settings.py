import os
from pathlib import Path
from datetime import timedelta
import dj_database_url

# Base Directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Security
DEBUG = True
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-your-secret-key-change-this')
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1,*').split(',')

if 'RENDER_EXTERNAL_HOSTNAME' in os.environ:
    FRONTEND_URL = f"https://{os.environ['RENDER_EXTERNAL_HOSTNAME']}"
else:
    FRONTEND_URL = "http://localhost:5173"

# Installed Apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',

    # Local apps
    'jobs.apps.JobsConfig',
    'accounts.apps.AccountsConfig',
]

# Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # CORS must be at the top
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = "job_portal_backend.urls"
WSGI_APPLICATION = "job_portal_backend.wsgi.application"

# Templates + React Build Support
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',

        # Load React index.html
        'DIRS': [
            os.path.join(BASE_DIR, "build")
        ],

        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# Email Configuration (Brevo/Sendinblue)
EMAIL_BACKEND = 'accounts.custom_email_backend.IPv4EmailBackend' # Keep IPv4 backend for Render network stability
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp-relay.brevo.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_USE_SSL = os.getenv('EMAIL_USE_SSL', 'False') == 'True'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '').strip()
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '').strip()
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'Jobportal <no-reply@yourdomain.com>')
EMAIL_TIMEOUT = 60

DATABASES = {
    'default': dj_database_url.config(
        default=f"postgres://{os.getenv('DB_USER', 'postgres')}:{os.getenv('DB_PASSWORD', 'Siva5107')}@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '5432')}/{os.getenv('DB_NAME', 'jobs')}",
        conn_max_age=600
    )
}

# Password Validators
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Localization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static & Media Files
STATIC_URL = '/staticfiles/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Serve React static files
build_path = BASE_DIR / "build"
STATICFILES_DIRS = [build_path] if build_path.exists() else []

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS Settings
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS', 'http://localhost,http://localhost:3000,http://localhost:5173,http://localhost:5174,http://127.0.0.1').split(',')
CORS_ALLOW_CREDENTIALS = True

# CSRF Settings
CSRF_TRUSTED_ORIGINS = ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:8000']
if 'RENDER_EXTERNAL_HOSTNAME' in os.environ:
    CSRF_TRUSTED_ORIGINS.append(f"https://{os.environ['RENDER_EXTERNAL_HOSTNAME']}")

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 4,
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}
