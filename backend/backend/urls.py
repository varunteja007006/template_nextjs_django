
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Schema view setup for Swagger and ReDoc
schema_view = get_schema_view(
   openapi.Info(
      title="Flare",
      default_version='v1',
      description="API documentation for Flare ERP CRM system",
    #   terms_of_service="https://www.example.com/terms/",
    #   contact=openapi.Contact(email="contact@example.com"),
    #   license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/user_management/', include("user_management.urls")),

    # Authentication APIs
    path('api/v1/auth/', include("login.urls")),
    re_path(r'^auth/', include('drf_social_oauth2.urls', namespace='drf')),

    # Swagger and ReDoc documentation URLs
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]   

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)