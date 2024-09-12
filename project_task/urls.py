from django.urls import path
from .views import *

urlpatterns = [
    # register user
    path('register/', register_user, name='register'),
    path('user/all', user_list, name='user_list'),
    # Project APIs
    path('projects/', project_list_create, name='project-list-create'),
    path('projects/<int:pk>/', project_detail, name='project-detail'),

    # Task APIs
    path('tasks/', task_list_create, name='task-list-create'),
    path('tasks/<int:pk>/', task_detail, name='task-detail'),

    # Custom APIs
    path('projects/<int:project_id>/task-count/', project_task_count, name='project-task-count'),
    path('user/projects/tasks/', user_project_tasks, name='user-project-tasks'),
    #template
    path('main/', main, name='main'),
]
