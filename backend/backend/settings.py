from dotenv import load_dotenv
from datetime import timedelta
from pathlib import Path
import os
load_dotenv()


GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv("DEBUG") == "True"

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework', 
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist', 
    'corsheaders', 
    'celery',
    'system',
    'appraisals',
    'employees',
    "notifications.apps.NotificationsConfig",
    "django_apscheduler",
    'attendance',
    'django_celery_beat',
    'django_celery_results',
]

SCHEDULER_AUTOSTART = True

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    # Added for static files in production when DEBUG=False
    'whitenoise.middleware.WhiteNoiseMiddleware', 
    
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
        'DIRS': [BASE_DIR / 'templates'],
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

WSGI_APPLICATION = 'backend.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {

        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),

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

TIME_ZONE = 'Asia/Dhaka'

USE_I18N = True

USE_TZ = True


# --- STATIC FILES (CSS, JavaScript, Images) ---

STATIC_URL = 'static/'
# Directory where collectstatic will put files for serving
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
# Optional: Directories to look for additional static files
STATICFILES_DIRS = [
    BASE_DIR / 'assets',
]


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
    "http://localhost:3001",
    "http://172.17.231.72:3001",

]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://172.17.231.72:3001",
]

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),    
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
EMAIL_HOST = 'smtp.office365.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER 


LOGIN_URL = os.getenv('LOGIN_URL')

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



# set the celery broker url
CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL')

CELERY_ACCEPT_CONTENT = ['application/json']

CELERY_RESULT_SERIALIZER = 'json'

CELERY_TASK_SERIALIZER = 'json'

# set the celery result backend
CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND')

# set the celery timezone
CELERY_TIMEZONE = 'Asia/Dhaka'

CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'