from rest_framework import serializers
from .models import Project, Task
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id',
                'username',
                'email',
                ]
class ProjectDetailSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%Y-%m-%d %I:%M %p', read_only=True)
    updated_at = serializers.DateTimeField(format='%Y-%m-%d %I:%M %p', read_only=True)
    user = UserSerializer()
    class Meta:
        model = Project
        fields = ['id',
         'title',
         'description',
         'user',
         'created_at',
         'updated_at']
    def get_created_at(self, obj):
        return obj.created_at.strftime('%Y-%m-%d %I:%M %p')
    def get_updated_at(self, obj):
        return obj.updated_at.strftime('%Y-%m-%d %I:%M %p')
        
class ProjectSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    class Meta:
        model = Project
        fields = '__all__'   
class ProjectUpdateSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())  # Handle user updates by ID
    class Meta:
        model = Project
        fields = [
            'title',
            'description',
            'user'
        ]
class TaskSerializer(serializers.ModelSerializer):
    created_at = serializers.DateTimeField(format='%Y-%m-%d %I:%M %p', read_only=True)
    updated_at = serializers.DateTimeField(format='%Y-%m-%d %I:%M %p', read_only=True)
    project = ProjectSerializer() 
    class Meta:
        model = Task
        fields = '__all__'
    def validate_status(self, value):
        valid_statuses = [choice[0] for choice in Task.STATUS_CHOICES]
        if value not in valid_statuses:
            raise serializers.ValidationError(f'"{value}" is not a valid choice.')
        return value
    def validate_priority(self, value):
        valid_priorities = [choice[0] for choice in Task.PRIORITY_CHOICES]
        if value not in valid_priorities:
            raise serializers.ValidationError(f'"{value}" is not a valid choice.')
        return value
class TaskUpdateSerializer(serializers.ModelSerializer):
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())  # Handle project updates by ID
    class Meta:
        model = Task
        fields = ['title', 'description', 'project', 'status','priority']
