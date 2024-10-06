from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairViewSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)  

        token['user'] = {
            'username': user.get_full_name(),
            'email': user.email,
        }
        return token