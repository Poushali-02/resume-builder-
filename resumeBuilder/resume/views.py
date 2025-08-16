from django.shortcuts import render, redirect, get_object_or_404
from .models import (
    Resume, Education, WorkExperience, ContactDetail, 
    ProgrammingSkill, LanguageSkill, OtherSkill, Project, Certification
)

from django.http import FileResponse, Http404
from user.models import Profile
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from datetime import datetime
from django.template.loader import get_template
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML, CSS
import tempfile
from django.conf import settings
import os
from functools import wraps

# Custom decorator for resume ownership validation
def resume_owner_required(view_func):
    """
    Decorator to ensure only the resume owner can access the view
    """
    @wraps(view_func)
    def _wrapped_view(request, resume_id, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect('login')
        
        resume = get_object_or_404(Resume, id=resume_id)
        
        # Check if user owns this resume
        if resume.user != request.user:
            # Determine the action being attempted based on the view function name
            action = view_func.__name__.replace('_', ' ').title()
            messages.error(request, f"🚫 You don't have permission to {action.lower()} this resume.")
            return redirect('home')
            
        return view_func(request, resume_id, *args, **kwargs)
    return _wrapped_view

# Create your views here.
def create(request):
    
    if not request.user.is_authenticated:
        return redirect('login')

    if request.method == 'POST':
        
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
        project_names = request.POST.getlist('project_name[]')
        project_descriptions = request.POST.getlist('project_description[]')
        project_technologies = request.POST.getlist('project_technologies[]')
        project_start_dates = request.POST.getlist('project_start_date[]')
        project_end_dates = request.POST.getlist('project_end_date[]')
        project_urls = request.POST.getlist('project_url[]')
        
        for i in range(len(project_names)):
            if project_names[i].strip():
                try:
                    # Parse dates from month input (YYYY-MM format)
                    start_date = datetime.strptime(project_start_dates[i], '%Y-%m') if i < len(project_start_dates) and project_start_dates[i] else None
                    
                    # Check if this is marked as current project
                    is_current = f"current_project_{i}" in request.POST
                    
                    # Set end date based on current status
                    if is_current:
                        end_date = None
                    else:
                        end_date = datetime.strptime(project_end_dates[i], '%Y-%m') if i < len(project_end_dates) and project_end_dates[i] else None
                    
                    Project.objects.create(
                        resume=resume,
                        title=project_names[i],
                        description=project_descriptions[i] if i < len(project_descriptions) else "",
                        technologies=project_technologies[i] if i < len(project_technologies) else "",
                        start_date=start_date,
                        end_date=end_date,
                        is_current=is_current,
                        link=project_urls[i] if i < len(project_urls) and project_urls[i].strip() else None
                    )
                except ValueError as e:
                    print(f"Date parsing error for project: {e}")

        certificate_names = request.POST.getlist('certificate_name[]')
        certificate_authorities = request.POST.getlist('certificate_authority[]')
        certificate_certified_fors = request.POST.getlist('certificate_certified_for[]')
        certificate_dates = request.POST.getlist('certificate_date[]')
        certificate_files = request.FILES.getlist('certificate_file[]')

        for i in range(len(certificate_names)):
            if certificate_names[i].strip():
                try:
                    # Parse dates from month input (YYYY-MM format)
                    date = datetime.strptime(certificate_dates[i], '%Y-%m') if i < len(certificate_dates) and certificate_dates[i] else None

                    Certification.objects.create(
                        resume=resume,
                        name=certificate_names[i],
                        authority=certificate_authorities[i] if i < len(certificate_authorities) else "",
                        certified_for=certificate_certified_fors[i] if i < len(certificate_certified_fors) else "",
                        date=date,
                        files=certificate_files[i] if i < len(certificate_files) else None
                    )
                except ValueError as e:
                    print(f"Date parsing error for Certificate: {e}")

        profile = Profile.objects.get(user=request.user)
        profile.resumeCount += 1
        profile.save()
        
        messages.success(request, f"🎉 Resume '{resume.full_name}' created successfully!")
        return redirect('see_resume', resume_id=resume.id)
    return render(request, 'website/createResume.html')


def see_resume(request, resume_id):
    
    if not request.user.is_authenticated:
        messages.warning(request, "You need to be logged in to view resumes.") 
        return redirect('login')
    
    try:
        resume = Resume.objects.get(id=resume_id)
        if resume.user != request.user and getattr(resume, 'resumePublic', False):
            messages.info(request, f"👀 You're viewing {resume.user.username}'s public resume: {resume.full_name}")
        
        if resume.user:
            related_user_resumes = Resume.objects.filter(user=resume.user).exclude(id=resume_id)
            
            if related_user_resumes.count() < 3 and resume.occupation:
                related_occupation_resumes = Resume.objects.filter(
                    occupation__icontains=resume.occupation
                ).exclude(id=resume_id).exclude(user=resume.user)[:3-related_user_resumes.count()]
                
                related_resumes = list(related_user_resumes) + list(related_occupation_resumes)
            else:
                related_resumes = related_user_resumes[:3]  # Limit to 3
        else:
            related_resumes = []
        
        context = {
            'resume': resume,
            'related_resumes': related_resumes
        }
        
        return render(request, 'website/resume.html', context)
    except Resume.DoesNotExist:
        return render(request, 'website/resume.html', {'resume': None})

@resume_owner_required
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
        project_names = request.POST.getlist('project_name[]')
        project_descriptions = request.POST.getlist('project_description[]')
        project_technologies = request.POST.getlist('project_technologies[]')
        project_start_dates = request.POST.getlist('project_start_date[]')
        project_end_dates = request.POST.getlist('project_end_date[]')
        project_urls = request.POST.getlist('project_url[]')
        
        for i in range(len(project_names)):
            if project_names[i].strip():
                try:
                    # Parse dates from month input (YYYY-MM format)
                    start_date = datetime.strptime(project_start_dates[i], '%Y-%m') if i < len(project_start_dates) and project_start_dates[i] else None
                    
                    # Check if this is marked as current project
                    is_current = f"current_project_{i}" in request.POST
                    
                    # Set end date based on current status
                    if is_current:
                        end_date = None
                    else:
                        end_date = datetime.strptime(project_end_dates[i], '%Y-%m') if i < len(project_end_dates) and project_end_dates[i] else None
                    
                    Project.objects.create(
                        resume=resume,
                        title=project_names[i],
                        description=project_descriptions[i] if i < len(project_descriptions) else "",
                        technologies=project_technologies[i] if i < len(project_technologies) else "",
                        start_date=start_date,
                        end_date=end_date,
                        is_current=is_current,
                        link=project_urls[i] if i < len(project_urls) and project_urls[i].strip() else None
                    )
                except ValueError as e:
                    print(f"Date parsing error for project: {e}")

        certificate_names = request.POST.getlist('certificate_name[]')
        certificate_authorities = request.POST.getlist('certificate_authority[]')
        certificate_certified_fors = request.POST.getlist('certificate_certified_for[]')
        certificate_dates = request.POST.getlist('certificate_date[]')
        certificate_files = request.FILES.getlist('certificate_file[]')

        for i in range(len(certificate_names)):
            if certificate_names[i].strip():
                try:
                    # Parse dates from month input (YYYY-MM format)
                    date = datetime.strptime(certificate_dates[i], '%Y-%m') if i < len(certificate_dates) and certificate_dates[i] else None

                    Certification.objects.create(
                        resume=resume,
                        name=certificate_names[i],
                        authority=certificate_authorities[i] if i < len(certificate_authorities) else "",
                        certified_for=certificate_certified_fors[i] if i < len(certificate_certified_fors) else "",
                        date=date,
                        files=certificate_files[i] if i < len(certificate_files) else None
                    )
                except ValueError as e:
                    print(f"Date parsing error for Certificate: {e}")
        
        messages.success(request, "✅ Resume updated successfully!")
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
        'certificates': Certification.objects.filter(resume=resume),
    }

    return render(request, 'website/editResume.html', context)

@resume_owner_required
def download_resume(request, resume_id):
    resume = get_object_or_404(Resume, id=resume_id)
    
    # Select template based on content size

    context = {
        'resume': resume,
        'contacts': ContactDetail.objects.filter(resume=resume),
        'experiences': WorkExperience.objects.filter(resume=resume),
        'educations': Education.objects.filter(resume=resume),
        'programming_skills': ProgrammingSkill.objects.filter(resume=resume),
        'languages': LanguageSkill.objects.filter(resume=resume),
        'other_skills': OtherSkill.objects.filter(resume=resume),
        'projects': Project.objects.filter(resume=resume),
        'certificates': Certification.objects.filter(resume=resume),
    }

    html_string = render_to_string('website/card.html', context)

    # PDF style
    pdf_bytes = HTML(
        string=html_string,
        base_url=request.build_absolute_uri('/')
    ).write_pdf(
        stylesheets=[
            CSS(string='@page { size: A4; } body { font-family: sans-serif; }')
        ]
    )

    filename = f"{resume.full_name.replace(' ', '_')}_resume.pdf"
    save_path = os.path.join(settings.MEDIA_ROOT, 'resumes', filename)
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    with open(save_path, 'wb') as f:
        f.write(pdf_bytes)

    resume.pdf_file.name = f"resumes/{filename}"
    resume.save(update_fields=['pdf_file'])

    return FileResponse(open(save_path, 'rb'), as_attachment=True, filename=filename)