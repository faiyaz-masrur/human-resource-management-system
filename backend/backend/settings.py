from datetime import timedelta
import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-1d!c19o-q==2!khj0k%7_d3l+dknhw#!y(3oa4&l_70%y&c1kr'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework', # Add this to enable Django REST Framework
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist', 
    'corsheaders', # Add this to handle Cross-Origin Resource Sharing
    'system',
    'appraisals',
    'employees',
    "notifications.apps.NotificationsConfig",
    "django_apscheduler",
    
]

SCHEDULER_AUTOSTART = True

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',

    'corsheaders.middleware.CorsMiddleware', 
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {

        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.environ.get('DB_NAME', 'performance_appraisal'),
        'USER': os.environ.get('DB_USER', 'root'),
        'PASSWORD': os.environ.get('DB_PASSWORD', 'root'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': '3306',

    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = 'static/'


MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'system.Employee' # Custom user model

# Django REST Framework settings
# http://www.django-rest-framework.org/api-guide/settings/
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ]
}

# CORS settings for allowing your React frontend to connect
# https://pypi.org/project/django-cors-headers/
CORS_ALLOWED_ORIGINS = [
    # Add your React frontend's URL here in production.
    # For development, you can use:
    "http://localhost:5173",
]

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=50),    
    "REFRESH_TOKEN_LIFETIME": timedelta(minutes=60),     
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": False,

    "ALGORITHM": "HS256",
    "SIGNING_KEY": SECRET_KEY,

    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
    "USER_ID_FIELD": "email",
    "USER_ID_CLAIM": "email",

    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
    "TOKEN_TYPE_CLAIM": "token_type",
    "TOKEN_USER_CLASS": "rest_framework_simplejwt.models.TokenUser",
    "JTI_CLAIM": "jti",
}



EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'faiyaz.masrur@gmail.com'  
EMAIL_HOST_PASSWORD = ''    
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# Company Information for Email Templates
COMPANY_NAME = 'Sonali Intellect Limited'

# ... (Keep all your existing settings above this line)

# =========================================================
# DJANGO-APSCHEDULER SETTINGS (Append to settings.py)
# =========================================================

# Ensure your TIME_ZONE is correct for the desired 9 AM execution time. 
# If your server time is UTC, 9 AM UTC will run at 9 AM UTC.
# TIME_ZONE = 'UTC' # Existing setting

SCHEDULER_AUTOSTART = True 

# Use the default database job store
SCHEDULER_JOBSTORES = {
    'default': {
        'type': 'django'
    }
}

# Define the format for datetimes when displayed in the Django Admin interface
# Note: Use a format appropriate for your region if you change TIME_ZONE
DJANGO_APSCHEDULER_DATETIME_FORMAT = "N j, Y, g:i a"

# Configure the scheduler's executor to allow concurrent jobs
SCHEDULER_EXECUTORS = {
    'default': {
        'class': 'apscheduler.executors.pool.ThreadPoolExecutor', 
        'max_workers': 10
    }
}

# Optional: Configuration for clearing old scheduler jobs (recommended)
# This keeps your database clean by removing jobs older than a week.
APSCHEDULER_RUN_NOW_TIMEOUT = 25  # seconds
SCHEDULER_AUTOSTART = True
