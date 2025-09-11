from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinLengthValidator
from .managers import CustomUserManager

# Create your models here.
class User(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), primary_key=True)
    employee_id = models.CharField(max_length=4, validators=[MinLengthValidator(4)], unique=True)
    

    # Remove first_name and last_name fields
    first_name = None
    last_name = None
    date_joined = None

    is_rm = models.BooleanField(default=False)
    is_hr = models.BooleanField(default=False)
    is_hod = models.BooleanField(default=False)
    is_coo = models.BooleanField(default=False)
    is_ceo = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  

    objects = CustomUserManager()

    def __str__(self):
        return self.email
