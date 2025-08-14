from django.shortcuts import render, redirect
from .models import Profile
from resume.models import Resume
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.decorators import login_required

# Create your views here.
def signup(request):
    if request.user.is_authenticated:
            return redirect('home')
    
    if request.method == "POST":
        name = request.POST.get("name")
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
       
        if User.objects.filter(username=username).exists():
            return redirect('signup')
        else:
            user = User.objects.create_user(username=username, email=email, password=password)
            Profile.objects.create(user=user, name=name)
            return redirect('login')
    return render(request, 'users/user.html')

def login(request):
    if request.user.is_authenticated:
            return redirect('home')

    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            auth_login(request, user)
            return redirect('home')
    return render(request, 'users/user.html')

@login_required
def logout(request):
    auth_logout(request)
    return redirect('login')

def home(request):
    # Get users with public resumes
    public_profiles = Profile.objects.filter(resumePublic=True)
    
    # Get all public resumes (resumes of users with public profiles)
    public_resumes = []
    
    for profile in public_profiles:
        # Get all resumes for this user and add them to our list
        user_resumes = Resume.objects.filter(user=profile.user).order_by('-updated_at')[:3]  # Limit to 3 most recent
        for resume in user_resumes:
            # Add some additional data to each resume
            resume.user_profile = profile
            
            # Get top skills (limited to 3)
            tech_skills = resume.programming_skills.all()[:3]
            resume.top_skills = tech_skills
            
            # Get most recent work experience
            latest_experience = resume.experiences.all().order_by('-start_date').first()
            resume.latest_job = latest_experience
            
            public_resumes.append(resume)
    
    # Get user's own resumes
    if request.user.is_authenticated:
        user_resumes = Resume.objects.filter(user=request.user).order_by('-updated_at')
    else:
        user_resumes = []
    
    context = {
        'public_resumes': public_resumes[:6],  # Limit to 6 public resumes
        'user_resumes': user_resumes,
    }
    
    return render(request, 'website/home.html', context)

@login_required
def profile(request):
    profile = Profile.objects.get(user=request.user)
    # Get all resumes for the current user
    user_resumes = Resume.objects.filter(user=request.user).order_by('-updated_at')
    return render(request, 'users/profile.html', {
        'profile': profile, 
        'user_resumes': user_resumes
    })

@login_required
def edit_profile(request, username):
    profile = Profile.objects.get(user__username=username)
    if request.method == "POST":
        profile.pfp = request.FILES.get("pfp", profile.pfp)
        profile.bio = request.POST.get("bio")
        profile.portfolio_link = request.POST.get('portfolio_link', profile.portfolio_link)
        profile.resumePublic = request.POST.get('resumePublic') == 'True'
        profile.save()
        return redirect('profile')
    return render(request, 'users/edit_profile.html', {'profile': profile})