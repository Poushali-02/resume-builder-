from django.contrib import admin
from .models import (
    Resume, Education, WorkExperience, ContactDetail, 
    ProgrammingSkill, LanguageSkill, OtherSkill, Project
)
# Register your models here.

admin.site.register(Resume)
admin.site.register(Education)
admin.site.register(WorkExperience)
admin.site.register(ContactDetail)
admin.site.register(ProgrammingSkill)
admin.site.register(LanguageSkill)
admin.site.register(OtherSkill)
admin.site.register(Project)
