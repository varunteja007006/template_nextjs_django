# views.py
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Group
from .serializer import GroupSerializer

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]  # Require authentication    
