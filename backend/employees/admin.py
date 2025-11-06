
from django.contrib import admin
from .models import PersonalDetail, Address, WorkExperience, Education, TrainingCertificate, Attatchment



admin.site.register(PersonalDetail)
admin.site.register(Address)
admin.site.register(WorkExperience)
admin.site.register(Education)
admin.site.register(TrainingCertificate)
admin.site.register(Attatchment)