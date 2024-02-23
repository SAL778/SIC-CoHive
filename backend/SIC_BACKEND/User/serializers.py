from rest_framework import serializers
from .models import CustomUser, Complete_Portfolio, PortfolioItem


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
       # fields = '__all__'
        fields = ["id", "username", "first_name", "last_name", "email", "is_staff", "is_superuser", "is_active", "date_joined", "last_login","portfolioVisibility","profileImage"]
        read_only_fields = ["id","is_staff", "is_superuser", "is_active", "date_joined", "last_login"]
        


class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = '__all__'
        read_only_fields = ["id"]
        