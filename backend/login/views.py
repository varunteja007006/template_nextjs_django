from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            # Check if tokens are present
            if 'access' in tokens and 'refresh' in tokens:
                access_token = tokens['access']
                refresh_token = tokens['refresh']

                # Set cookies in the existing response object
                response.set_cookie(
                    key='access_token', 
                    value=access_token, 
                    httponly=True, 
                    secure=True, 
                    samesite='None',
                    path='/'
                )
                response.set_cookie(
                    key='refresh_token', 
                    value=refresh_token, 
                    httponly=True, 
                    secure=True, 
                    samesite='None',
                    path='/'
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
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            refresh_token = request.COOKIES.get('refresh_token')

            if 'access' in tokens and 'refresh' in tokens:
                access_token = tokens['access']
                refresh_token = tokens['refresh']
                # Set cookies in the existing response object
                response.set_cookie(
                    key='access_token', 
                    value=access_token, 
                    httponly=True, 
                    secure=True, 
                    samesite='None',
                    path='/'
                )
                response.set_cookie(
                    key='refresh_token', 
                    value=refresh_token, 
                    httponly=True, 
                    secure=True, 
                    samesite='None',
                    path='/'
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
        user = User.objects.get(username=request.data["username"])
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 
                         'created': created, 
                         'full_name': user.get_full_name(), 
                         'email': user.email  }, 
                        status=status.HTTP_200_OK)
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

        return Response({
            'token': token.key,
            'created': created,
            'full_name': user.get_full_name(),
            'email': user.email
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        user = request.user
        token = Token.objects.get(user=user)
        token.delete()
        return Response({ 'success': True },status=status.HTTP_200_OK)
    except Token.DoesNotExist:
        return Response({'error': 'Token not found'},status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication])
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
@authentication_classes([TokenAuthentication])
def emergency_logout(request):
    deleted_count, _ = Token.objects.all().delete()
    return Response({'message': f'{deleted_count} tokens deleted.'}, status=status.HTTP_200_OK)

