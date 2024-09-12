from django.urls import path
from .views import *

urlpatterns = [
    path('registerUser', registerUser, name='register_user'),
    path('projects', project_page, name='projects'),
    path('tasks/management', task_management, name='task_management'),
    path('success', success, name='success'),
]
