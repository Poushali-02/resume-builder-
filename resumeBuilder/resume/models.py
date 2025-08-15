from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Resume(models.Model):
    # Basic information
    user = models.ForeignKey(User, related_name='resumes', on_delete=models.CASCADE, null=True, blank=True)
    full_name = models.CharField(max_length=255)
    occupation = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to='resumes/images/', blank=True, null=True)
    pdf_file = models.FileField(upload_to='resumes/', blank=True, null=True)
    # Contact details
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.CharField(max_length=255, blank=True, null=True)
    
    # Professional details
    summary = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(default=None, null=True, blank=True)
    updated_at = models.DateTimeField(default=None, null=True, blank=True)
    
    
    def save(self, *args, **kwargs):
        from django.utils import timezone
        if not self.created_at:
            self.created_at = timezone.now()
        self.updated_at = timezone.now()
        super(Resume, self).save(*args, **kwargs)
    
    def __str__(self):
        return self.full_name

class ContactDetail(models.Model):
    resume = models.ForeignKey(Resume, related_name='contact_details', on_delete=models.CASCADE)
    contact_type = models.CharField(max_length=50)  # LinkedIn, Website, GitHub, etc.
    contact_value = models.CharField(max_length=255)
    
    def __str__(self):
        return f"{self.contact_type}: {self.contact_value}"

class WorkExperience(models.Model):
    resume = models.ForeignKey(Resume, related_name='experiences', on_delete=models.CASCADE)
    job_title = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    location = models.CharField(max_length=100, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.job_title} at {self.company}"

class Education(models.Model):
    resume = models.ForeignKey(Resume, related_name='educations', on_delete=models.CASCADE)
    degree = models.CharField(max_length=100)
    institution = models.CharField(max_length=100)
    location = models.CharField(max_length=100, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.degree} at {self.institution}"
    
class ProgrammingSkill(models.Model):
    LEVEL_CHOICES = (
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
        ('Expert', 'Expert'),
    )
    resume = models.ForeignKey(Resume, related_name='programming_skills', on_delete=models.CASCADE)
    skill= models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    
    def __str__(self):
        return f"{self.skill_name} ({self.level})"
    
class LanguageSkill(models.Model):
    LEVEL_CHOICES = (
        ('Basic', 'Basic'),
        ('Intermediate', 'Intermediate'),
        ('Fluent', 'Fluent'),
        ('Native', 'Native'),
    )
    resume = models.ForeignKey(Resume, related_name='language_skills', on_delete=models.CASCADE)
    language = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    
    def __str__(self):
        return f"{self.language} ({self.level})"
    
class OtherSkill(models.Model):
    resume = models.ForeignKey(Resume, related_name='other_skills', on_delete=models.CASCADE)
    skill = models.CharField(max_length=100)
    
    def __str__(self):
        return self.skill
    
    
class Project(models.Model):
    resume = models.ForeignKey(Resume, related_name='projects', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    technologies = models.CharField(max_length=500, blank=True, null=True)  # Technologies used
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    is_current = models.BooleanField(default=False)  # Is this project ongoing?
    link = models.URLField(blank=True, null=True)  # Optional: project URL like GitHub or live site

    def __str__(self):
        return self.title