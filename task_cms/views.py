
from django.shortcuts import render
from project_task.views import *
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
def registerUser(request):
    return render(request, 'main.html')

def project_page(request):
    return render(request, 'projects.html')

def task_management(request):
    return render(request,'task_details.html')

def success(request):
    return render(request,'success.html')