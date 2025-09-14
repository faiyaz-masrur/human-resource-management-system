from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['employee_id', 'email', 'is_rm', 'is_hr', 'is_hod', 'is_coo', 'is_ceo']


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # The default result (access/refresh tokens)
        data = super().validate(attrs)
        
        # Serialize the user data and add it to the response
        serializer = UserSerializer(self.user)
        user_data = serializer.data
        
        data['user'] = user_data
        return data