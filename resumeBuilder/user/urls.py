from . import views
from django.urls import path

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('home/', views.home, name='home'),
    path('profile/', views.profile, name='profile'),
    path('profile/<str:username>/', views.edit_profile, name='edit_profile'),
    path('logout/', views.logout, name='logout'),
]