# urls.py
from django.urls import path
from .views import GroupViewSet

urlpatterns = [
    path('groups', GroupViewSet.as_view({'get': 'list'}), name="groups"),
]
