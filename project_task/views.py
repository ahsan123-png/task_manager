import random
import json
from typing import Any
from django.http import JsonResponse
from .models import *
from rest_framework.decorators import api_view 
from rest_framework.response import Response 
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import *
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import render
# ============= views ==============
#create User
@csrf_exempt
def register_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            username = data.get('username', '')
            email = data.get('email', '')
            if not username or not email:
                return JsonResponse({
                    'success': False,
                    'message': 'Username and email are required.'
                }, status=400)
            if User.objects.filter(username=username).exists():
                return JsonResponse({
                    'success': False,
                    'message': 'Username already exists.'
                }, status=400)
            User.objects.create(username=username, email=email)
            return JsonResponse({
                'success': True,
                'message': 'User has been added successfully!'
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({
                'success': False,
                'message': 'Invalid JSON data'
            }, status=400)
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': str(e)
            }, status=500)
    else:
        return JsonResponse({
            'success': False,
            'message': 'Method Not Allowed'
        }, status=405)
# Project CRUD - List and Create
@csrf_exempt
@api_view(['GET', 'POST'])
def project_list_create(request):
    if request.method == 'GET':
        projects = Project.objects.all()
        serializer = ProjectDetailSerializer(projects, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#get all user
@api_view(['GET'])
def user_list(request):
    if request.method == 'GET':
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
# Project CRUD - Retrieve, Update, Delete
@csrf_exempt
@api_view(['GET', 'PUT', 'DELETE'])
def project_detail(request, pk):
    project = get_object_or_404(Project, pk=pk)
    if request.method == 'GET':
        serializer = ProjectSerializer(project)
        return Response(serializer.data)
    elif request.method == 'PUT':
        data = request.data  # No need to use JSONParser here
        serializer = ProjectUpdateSerializer(project, data=data, partial=True)  # Partial update
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)  
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
@api_view(['GET', 'POST'])
def task_list_create(request):
    if request.method == 'GET':
        tasks = Task.objects.all()
        serializer = TaskSerializer(tasks, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = TaskUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET', 'PUT', 'DELETE'])
def task_detail(request, pk):
    task = get_object_or_404(Task, pk=pk)
    if request.method == 'GET':
        serializer = TaskSerializer(task)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = TaskUpdateSerializer(task, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print("Serializer errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        task.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
@api_view(['GET'])
def project_task_count(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    task_count = project.tasks.count()
    return Response({'project': project.title, 'task_count': task_count})
# view main 
def main(request):
    return render(request,"main.html")
#Some Userfull methods
def generate_username():
    username = ""
    capitalize = [True, False]
    for i in range(0, 31):
        if capitalize[random.randint(0, 1)]:
            username += chr(random.randint(97, 117))
        else:
            username += chr(random.randint(65, 91))
    return username

# Sub Methods


def get_request_body(request):
    return json.loads(request.body)


def good_response(method: str, data: dict | Any, status: int = 200):
    return {
        "success": True,
        "data": data,
        "method": method,
        "status": status,
    }


def bad_response(method: str, reason: str, status: int = 403, data: dict | Any = None):
    return {
        "success": False,
        "reason": reason,
        "data": data,
        "status": status,
        "method": method,
    }