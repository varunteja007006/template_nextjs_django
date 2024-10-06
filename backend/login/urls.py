from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("login", views.login, name="login"),
    path("sign-up", views.signup, name="signup"),
    path("logout", views.logout, name="logout"),
    path("test-token", views.test_token, name="test_token"),
    path("emergency-logout", views.emergency_logout, name="emergency_logout"),
    path('login/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('login/token/variant_custom', views.CustomTokenObtainPairView.as_view() , name='token_obtain_pair_customized'),
    path('login/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('login/token/refresh/variant_custom', views.CustomTokenRefreshView.as_view(), name='token_refresh_customized'),
]