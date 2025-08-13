from django.shortcuts import render, redirect

def home_view(request):
    if request.user.is_authenticated:
        return redirect('home_view')
    else:
        return render(request, 'website/home.html')