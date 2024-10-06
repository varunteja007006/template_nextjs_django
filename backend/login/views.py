from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.shortcuts import get_object_or_404
from datetime import datetime, timedelta
from .serializer import CustomTokenObtainPairViewSerializer

isHTTPOnly = False
isSecure = False
isSameSite = 'None'
isPath = '/'
minutes = 60
days_30 = 30
days_1 =1


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairViewSerializer

    def post(self, request, *args, **kwargs):
        try:
            # user info will go here, gets validated and returns the tokens 
            response = super().post(request, *args, **kwargs)

            tokens = response.data

            # check for tokens
            if 'access' in tokens and 'refresh' in tokens:
                access_token = tokens['access']
                refresh_token = tokens['refresh']

                # set cookies for both access and refresh
                response.set_cookie(
                    key='access_token', 
                    value=access_token, 
                    httponly=isHTTPOnly, 
                    secure=isSecure, 
                    samesite=isSameSite,
                    path=isPath,
                    expires=datetime.now() + timedelta(minutes=minutes)
                )

                response.set_cookie(
                    key='refresh_token', 
                    value=refresh_token, 
                    httponly=isHTTPOnly, 
                    secure=isSecure, 
                    samesite=isSameSite,
                    path=isPath,
                    expires=datetime.now() + timedelta(days=days_30)
                )

                response.data = {'success': True}

            return response
        
        except KeyError as e:
            return Response({'error': f'Missing token: {str(e)}', 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e), 'success': False}, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            # get the refresh token from the cookies and attach it to the request body
            refresh_token = request.COOKIES.get('refresh_token')

            if not refresh_token:
                return Response({'error': 'Refresh token missing or expired'}, status=status.HTTP_400_BAD_REQUEST)

            request.data['refresh'] = refresh_token

            # now pass the request with refresh token to generate the access and refresh tokens
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            if 'access' in tokens:
                access_token = tokens['access']

                response.set_cookie(
                    key='access_token', 
                    value=access_token, 
                    httponly=isHTTPOnly, 
                    secure=isSecure, 
                    samesite=isSameSite,
                    path=isPath,
                    expires=datetime.now() + timedelta(minutes=minutes)
                )

                response.data = {'success': True}
                
            return response 
        except KeyError as e:
            return Response({'error': f'Missing token: {str(e)}', 'success': False}, status=status.HTTP_400_BAD_REQUEST)            
        except Exception as e:
            return Response({'error': str(e), 'success': False}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    try:
        user = get_object_or_404(User, username=request.data["username"])

        if not user.check_password(request.data["password"]):
            return Response({'error': 'Invalid password'}, status=status.HTTP_401_UNAUTHORIZED)
        
        token, created = Token.objects.get_or_create(user=user)

        response = Response()

        response.data = {'token': token.key, 
                         'created': created, 
                         'full_name': user.get_full_name(), 
                         'email': user.email  }
        

        response.set_cookie(
            key='token',
            value=token.key, 
            httponly=isHTTPOnly, 
            secure=isSecure, 
            samesite=isSameSite,
            path=isPath,
            expires = datetime.now() + timedelta(days=days_1)
        )

        response.status_code = status.HTTP_200_OK
        return response
    
    except User.DoesNotExist:
        return Response({'error': 'User not found'},status=status.HTTP_404_NOT_FOUND)
    
@api_view(['POST'])
def signup(request):
    try:
        # Check if the username already exists
        if User.objects.filter(username=request.data["username"]).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_409_CONFLICT)
        
        # Check if the email already exists
        if User.objects.filter(email=request.data["email"]).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_409_CONFLICT)

        user = User.objects.create_user(
            username=request.data["username"],
            email=request.data["email"],
            first_name=request.data["first_name"],
            last_name=request.data["last_name"],
            password=request.data["password"]
        )        
        user.save()
        
        token, created = Token.objects.get_or_create(user=user)

        response = Response()

        response.data = {'token': token.key, 
                         'created': created, 
                         'full_name': user.get_full_name(), 
                         'email': user.email  }
        
        response.set_cookie(
            key='token',
            value=token.key, 
            httponly=isHTTPOnly, 
            secure=isSecure, 
            samesite=isSameSite,
            path=isPath,
            expires = datetime.now() + timedelta(days=days_1)
        )

        response.status_code = status.HTTP_201_CREATED
        return response

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        if 'token' not in request.COOKIES and 'access_token' not in request.COOKIES and 'refresh_token' not in request.COOKIES:
            return Response({'error': 'Token not found'},status=status.HTTP_404_NOT_FOUND)

        if 'token' in request.COOKIES:
            token = Token.objects.get(key=request.COOKIES.get('token'))
            if token.user.is_authenticated:
                token.delete()

        # now delete the tokens from the cookies
        res = Response()

        res.data = {'success': True}

        res.delete_cookie('token')
        res.delete_cookie('access_token')
        res.delete_cookie('refresh_token')

        res.status_code = status.HTTP_200_OK

        return res
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def test_token(request):
    if request.user.is_authenticated:
        user_data = {
            'email': request.user.email,
            'isAuthenticated': request.user.is_authenticated
        }
        return Response(user_data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'User not authenticated'},status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def emergency_logout(request):
    deleted_count, _ = Token.objects.all().delete()
    return Response({'message': f'{deleted_count} tokens deleted.'}, status=status.HTTP_200_OK)

