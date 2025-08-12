from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create, name='create'),
    path('see/<int:resume_id>/', views.see_resume, name='see_resume'),
    path('edit/<int:resume_id>/', views.edit_resume, name='edit_resume'),
]
