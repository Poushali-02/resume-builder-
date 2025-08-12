from django.shortcuts import render, redirect, get_object_or_404
from .models import (
    Resume, Education, WorkExperience, ContactDetail, 
    ProgrammingSkill, LanguageSkill, OtherSkill, Project
)

from user.models import Profile

from django.contrib.auth.decorators import login_required
from datetime import datetime

# Create your views here.
@login_required
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
        
        # Process projects
        project_titles = request.POST.getlist('project_title[]')
        project_descriptions = request.POST.getlist('project_description[]')
        project_links = request.POST.getlist('project_link[]')
        
        for i in range(len(project_titles)):
            if project_titles[i].strip():
                Project.objects.create(
                    resume=resume,
                    title=project_titles[i],
                    description=project_descriptions[i] if i < len(project_descriptions) else "",
                    link=project_links[i] if i < len(project_links) and project_links[i].strip() else None
                )
        
        profile = Profile.objects.get(user=request.user)
        profile.resumeCount += 1
        profile.save()
        
        return redirect('see_resume', resume_id=resume.id)
    return render(request, 'website/createResume.html')

@login_required
def see_resume(request, resume_id):
    resume = Resume.objects.get(id=resume_id)
    if resume is not None:
        return render(request, 'website/resume.html', {'resume': resume})
    return render(request, 'website/resume.html', {'resume': None})

@login_required
def edit_resume(request, resume_id):
    resume = get_object_or_404(Resume, id=resume_id)

    if request.method == 'POST':
        # Update basic info
        resume.full_name = request.POST.get('full_name')
        resume.email = request.POST.get('email')
        resume.phone = request.POST.get('phone')
        resume.address = request.POST.get('address')
        resume.occupation = request.POST.get('occupation')
        resume.summary = request.POST.get('summary', '')
        resume.resumePublic = request.POST.get('resumePublic', 'off') == 'on'

        # Update image only if new file provided
        if 'image' in request.FILES:
            resume.image = request.FILES['image']

        resume.save()

        # --- Clear old related data so we can replace ---
        ContactDetail.objects.filter(resume=resume).delete()
        WorkExperience.objects.filter(resume=resume).delete()
        Education.objects.filter(resume=resume).delete()
        ProgrammingSkill.objects.filter(resume=resume).delete()
        LanguageSkill.objects.filter(resume=resume).delete()
        OtherSkill.objects.filter(resume=resume).delete()
        Project.objects.filter(resume=resume).delete()

        # --- Contacts ---
        contact_types = request.POST.getlist('contact_type[]')
        contact_values = request.POST.getlist('contact_value[]')
        for i in range(len(contact_types)):
            if i < len(contact_values) and contact_types[i].strip() and contact_values[i].strip():
                ContactDetail.objects.create(
                    resume=resume,
                    contact_type=contact_types[i],
                    contact_value=contact_values[i]
                )

        # --- Work Experiences ---
        job_titles = request.POST.getlist('job_title[]')
        companies = request.POST.getlist('company[]')
        job_locations = request.POST.getlist('job_location[]')
        job_start_dates = request.POST.getlist('job_start_date[]')
        job_end_dates = request.POST.getlist('job_end_date[]')
        job_descriptions = request.POST.getlist('job_description[]')

        for i in range(len(job_titles)):
            if job_titles[i].strip() and companies[i].strip():
                try:
                    start_date = datetime.strptime(job_start_dates[i], '%Y-%m') if i < len(job_start_dates) and job_start_dates[i] else datetime.now()
                    is_current = f"current_job_{i}" in request.POST
                    end_date = None if is_current else (
                        datetime.strptime(job_end_dates[i], '%Y-%m') if i < len(job_end_dates) and job_end_dates[i] else None
                    )
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
                    print(f"Date parse error for work: {e}")

        # --- Education ---
        degrees = request.POST.getlist('degree[]')
        institutions = request.POST.getlist('institution[]')
        edu_locations = request.POST.getlist('edu_location[]')
        edu_start_dates = request.POST.getlist('edu_start_date[]')
        edu_end_dates = request.POST.getlist('edu_end_date[]')
        edu_descriptions = request.POST.getlist('edu_description[]')

        for i in range(len(degrees)):
            if degrees[i].strip() and institutions[i].strip():
                try:
                    start_date = datetime.strptime(edu_start_dates[i], '%Y-%m') if i < len(edu_start_dates) and edu_start_dates[i] else datetime.now()
                    is_current = f"current_edu_{i}" in request.POST
                    end_date = None if is_current else (
                        datetime.strptime(edu_end_dates[i], '%Y-%m') if i < len(edu_end_dates) and edu_end_dates[i] else None
                    )
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
                    print(f"Date parse error for edu: {e}")

        # --- Programming skills ---
        programming_skills = request.POST.getlist('programming_skill[]')
        programming_levels = request.POST.getlist('programming_level[]')
        for i in range(len(programming_skills)):
            if programming_skills[i].strip():
                ProgrammingSkill.objects.create(
                    resume=resume,
                    skill_name=programming_skills[i],
                    level=programming_levels[i] if i < len(programming_levels) else "Beginner"
                )

        # --- Languages ---
        languages = request.POST.getlist('language[]')
        language_levels = request.POST.getlist('language_level[]')
        for i in range(len(languages)):
            if languages[i].strip():
                LanguageSkill.objects.create(
                    resume=resume,
                    language=languages[i],
                    level=language_levels[i] if i < len(language_levels) else "Basic"
                )

        # --- Other skills ---
        other_skills = request.POST.getlist('other_skill[]')
        for skill in other_skills:
            if skill.strip():
                OtherSkill.objects.create(
                    resume=resume,
                    skill=skill
                )

        # --- Projects ---
        project_titles = request.POST.getlist('project_title[]')
        project_descriptions = request.POST.getlist('project_description[]')
        project_links = request.POST.getlist('project_link[]')
        
        for i in range(len(project_titles)):
            if project_titles[i].strip():
                Project.objects.create(
                    resume=resume,
                    title=project_titles[i],
                    description=project_descriptions[i] if i < len(project_descriptions) else "",
                    link=project_links[i] if i < len(project_links) and project_links[i].strip() else None
                )

        return redirect('see_resume', resume_id=resume.id)

    context = {
        'resume': resume,
        'contacts': ContactDetail.objects.filter(resume=resume),
        'experiences': WorkExperience.objects.filter(resume=resume),
        'educations': Education.objects.filter(resume=resume),
        'programming_skills': ProgrammingSkill.objects.filter(resume=resume),
        'languages': LanguageSkill.objects.filter(resume=resume),
        'other_skills': OtherSkill.objects.filter(resume=resume),
        'programming_level_choices': ProgrammingSkill.LEVEL_CHOICES,
        'language_level_choices': LanguageSkill.LEVEL_CHOICES,
        'projects': Project.objects.filter(resume=resume),
    }

    return render(request, 'website/editResume.html', context)
