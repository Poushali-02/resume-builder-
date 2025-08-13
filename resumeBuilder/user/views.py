from django.shortcuts import render, redirect
from .models import Profile
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

@login_required
def home(request):
    return render(request, 'website/home.html')

@login_required
def profile(request):
    profile = Profile.objects.get(user=request.user)
    return render(request, 'users/profile.html', {'profile': profile})

@login_required
def edit_profile(request, username):
    profile = Profile.objects.get(user__username=username)
    if request.method == "POST":
        profile.pfp = request.FILES.get("pfp", profile.pfp)
        profile.bio = request.POST.get("bio")
        profile.portfolio_link = request.POST.get('portfolio_link', profile.portfolio_link)
        profile.save()
        return redirect('profile')
    return render(request, 'users/edit_profile.html', {'profile': profile})