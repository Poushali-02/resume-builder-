from django.db import models

# Create your models here.
class Resume(models.Model):
    full_name = models.CharField(max_length=255)
    about = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='resumes/images/', blank=True, null=True)
    occupation = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    experience = models.TextField()
    summary = models.TextField()
    languages = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.full_name

class Education(models.Model):
    resume = models.ForeignKey(Resume, related_name='educations', on_delete=models.CASCADE)
    degree = models.CharField(max_length=100)
    institution = models.CharField(max_length=100)
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.degree} - {self.institution}"
    
class Skills(models.Model):
    resume = models.ForeignKey(Resume, related_name='skills_list', on_delete=models.CASCADE)
    skill_type = models.CharField(max_length=100)
    skill_description = models.TextField()
    
    def __str__(self):
        return self.skill_type