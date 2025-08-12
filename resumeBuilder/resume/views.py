from django.shortcuts import render, redirect
from .models import (
    Resume, Education, WorkExperience, ContactDetail, 
    ProgrammingSkill, LanguageSkill, OtherSkill
)
from django.contrib.auth.decorators import login_required
from datetime import datetime

# Create your views here.
def create(request):
    if request.method == 'POST':
        # Get basic info
        name = request.POST.get('full_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        address = request.POST.get('address')
        occupation = request.POST.get('occupation')
        summary = request.POST.get('summary', '')
        
        # Create the resume
        resume = Resume.objects.create(
            full_name=name,
            email=email,
            phone=phone,
            address=address,
            occupation=occupation,
            summary=summary,
            user=request.user if request.user.is_authenticated else None
        )
        
        # Handle image upload
        if 'image' in request.FILES:
            resume.image = request.FILES['image']
            resume.save()
        
        # Process additional contact details
        contact_types = request.POST.getlist('contact_type[]')
        contact_values = request.POST.getlist('contact_value[]')
        
        for i in range(len(contact_types)):
            if i < len(contact_values) and contact_types[i].strip() and contact_values[i].strip():
                ContactDetail.objects.create(
                    resume=resume,
                    contact_type=contact_types[i],
                    contact_value=contact_values[i]
                )
        
        # Process work experience
        job_titles = request.POST.getlist('job_title[]')
        companies = request.POST.getlist('company[]')
        job_locations = request.POST.getlist('job_location[]')
        job_start_dates = request.POST.getlist('job_start_date[]')
        job_end_dates = request.POST.getlist('job_end_date[]')
        job_descriptions = request.POST.getlist('job_description[]')
        
        for i in range(len(job_titles)):
            if job_titles[i].strip() and companies[i].strip():
                try:
                    # Parse dates from month input (YYYY-MM format)
                    start_date = datetime.strptime(job_start_dates[i], '%Y-%m') if i < len(job_start_dates) and job_start_dates[i] else datetime.now()
                    
                    # Check if this is marked as current job - properly handle checkbox values
                    is_current = f"current_job_{i}" in request.POST
                    
                    # Set end date based on current status
                    if is_current:
                        end_date = None
                    else:
                        end_date = datetime.strptime(job_end_dates[i], '%Y-%m') if i < len(job_end_dates) and job_end_dates[i] else None
                    
                    WorkExperience.objects.create(
                        resume=resume,
                        job_title=job_titles[i],
                        company=companies[i],
                        location=job_locations[i] if i < len(job_locations) else "",
                        start_date=start_date,
                        end_date=end_date,
                        is_current=is_current,
                        description=job_descriptions[i] if i < len(job_descriptions) else ""
                    )
                except ValueError as e:
                    print(f"Date parsing error for work experience: {e}")
        
        # Process education
        degrees = request.POST.getlist('degree[]')
        institutions = request.POST.getlist('institution[]')
        edu_locations = request.POST.getlist('edu_location[]')
        edu_start_dates = request.POST.getlist('edu_start_date[]')
        edu_end_dates = request.POST.getlist('edu_end_date[]')
        edu_descriptions = request.POST.getlist('edu_description[]')
        
        for i in range(len(degrees)):
            if degrees[i].strip() and institutions[i].strip():
                try:
                    # Parse dates from month input (YYYY-MM format)
                    start_date = datetime.strptime(edu_start_dates[i], '%Y-%m') if i < len(edu_start_dates) and edu_start_dates[i] else datetime.now()
                    
                    # Check if this is marked as current education - properly handle checkbox values
                    is_current = f"current_edu_{i}" in request.POST
                    
                    # Set end date based on current status
                    if is_current:
                        end_date = None
                    else:
                        end_date = datetime.strptime(edu_end_dates[i], '%Y-%m') if i < len(edu_end_dates) and edu_end_dates[i] else None
                    
                    Education.objects.create(
                        resume=resume,
                        degree=degrees[i],
                        institution=institutions[i],
                        location=edu_locations[i] if i < len(edu_locations) else "",
                        start_date=start_date,
                        end_date=end_date,
                        is_current=is_current,
                        description=edu_descriptions[i] if i < len(edu_descriptions) else ""
                    )
                except ValueError as e:
                    print(f"Date parsing error for education: {e}")
                    
        # Process programming skills
        programming_skills = request.POST.getlist('programming_skill[]')
        programming_levels = request.POST.getlist('programming_level[]')
        
        for i in range(len(programming_skills)):
            if programming_skills[i].strip():
                level = programming_levels[i] if i < len(programming_levels) else "Beginner"
                ProgrammingSkill.objects.create(
                    resume=resume,
                    skill_name=programming_skills[i],
                    level=level
                )
                
        # Process language skills
        languages = request.POST.getlist('language[]')
        language_levels = request.POST.getlist('language_level[]')
        
        for i in range(len(languages)):
            if languages[i].strip():
                level = language_levels[i] if i < len(language_levels) else "Basic"
                LanguageSkill.objects.create(
                    resume=resume,
                    language=languages[i],
                    level=level
                )
                
        # Process other skills
        other_skills = request.POST.getlist('other_skill[]')
        
        for skill in other_skills:
            if skill.strip():
                OtherSkill.objects.create(
                    resume=resume,
                    skill=skill
                )
        
        return redirect('see_resume', resume_id=resume.id)
    return render(request, 'website/createResume.html')


def see_resume(request, resume_id):
    resume = Resume.objects.get(id=resume_id)
    if resume is not None:
        return render(request, 'website/resume.html', {'resume': resume})
    return render(request, 'website/resume.html', {'resume': None})
