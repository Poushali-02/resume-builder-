from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create, name='createResume'),
    path('see/<int:resume_id>/', views.see_resume, name='see_resume')
]
