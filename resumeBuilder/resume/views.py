from django.shortcuts import render, redirect
from .models import Resume, Education, Skills
from datetime import datetime

# Create your views here.

def create(request):
    if request.method == 'POST':
        name = request.POST.get('full_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        experience = request.POST.get('experience')
        summary = request.POST.get('summary')
        
        # Get education form fields
        degree = request.POST.get('degree')
        institution = request.POST.get('institution')
        start_date = request.POST.get('start_date') 
        end_date = request.POST.get('end_date')
        education_description = request.POST.get('education_description')

        # First create the resume
        resume = Resume.objects.create(
            full_name=name,
            email=email,
            phone=phone,
            experience=experience,
            summary=summary
        )
        
        # Now create education entry with separate fields
        if degree and institution:
            try:
                # Parse the dates if they exist
                start_date_obj = datetime.strptime(start_date, '%Y-%m-%d') if start_date else datetime.now()
                end_date_obj = datetime.strptime(end_date, '%Y-%m-%d') if end_date else datetime.now()
                
                education = Education.objects.create(
                    resume=resume,
                    degree=degree,
                    institution=institution,
                    start_date=start_date_obj,
                    end_date=end_date_obj,
                    description=education_description or ""
                )
            except ValueError as e:
                # Handle date parsing errors
                print(f"Date parsing error: {e}")
                # Create with default dates as fallback
                education = Education.objects.create(
                    resume=resume,
                    degree=degree,
                    institution=institution,
                    start_date=datetime.now(),
                    end_date=datetime.now(),
                    description=education_description or ""
                )
        
        # Process skills with detailed information
        skill_types = request.POST.getlist('skill_types[]')
        skill_descriptions = request.POST.getlist('skill_descriptions[]')
        
        # Create skills entries
        for i in range(len(skill_types)):
            if skill_types[i].strip():  # Only create if skill type is provided
                skill_description = skill_descriptions[i].strip() if i < len(skill_descriptions) else f"Proficient in {skill_types[i]}"
                Skills.objects.create(
                    resume=resume,
                    skill_type=skill_types[i],
                    skill_description=skill_description
                )
        
        return redirect('see_resume', resume_id=resume.id)
    return render(request, 'website/createResume.html')


def see_resume(request, resume_id):
    resume = Resume.objects.get(id=resume_id)
    if resume is not None:
        return render(request, 'website/resume.html', {'resume': resume})
    return render(request, 'website/resume.html', {'resume': None})
