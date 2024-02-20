from rest_framework import serializers
from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
     #   fields = '__all__'
        fields = ["id", "username", "first_name", "last_name", "email", "role", "is_staff", "is_superuser", "is_active", "date_joined", "last_login"]
        read_only_fields = ["id","is_staff", "is_superuser", "is_active", "date_joined", "last_login"]
