from typing import Tuple
from django.contrib.auth.models import User
from rest_framework.request import Request
from  rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import Token 


class CustomCookiesJWTAuthentication(JWTAuthentication):
    def authenticate(self, request: Request):
        access_token =  request.COOKIES.get('access_token')

        if access_token:
            try:
                validated_token = self.get_validated_token(access_token)
                try:
                    user = self.get_user(validated_token)
                except User.DoesNotExist:
                    return None
                return user, validated_token
            except Exception:
                return None

        return None
