from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    pfp = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    name = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    resumeCount = models.PositiveIntegerField(default=0)
    portfolio_link = models.URLField(blank=True, null=True)
    resumePublic = models.BooleanField(default=False)
    
    def get_first_name(self):
        if self.name:
            return self.name.split(' ')[0]
        return ""
    
    def __str__(self):
        return self.user.username