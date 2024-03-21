from rest_framework import serializers
from .models import CustomUser, Complete_Portfolio, PortfolioItem, AccessType, Flair_Roles, AppLink
from django.db import transaction

class AppLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppLink
        fields = ['feedback_form_link', 'google_drive_link', 'google_calendar_link']

class FlairRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Flair_Roles
        fields = ['id','role_name']
        read_only_fields = ["id"]
        
class AccessTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessType
        fields = ['name']
        
class CustomUserSerializer(serializers.ModelSerializer):
    accessType = AccessTypeSerializer(read_only=True, many=True)
    flair_roles = FlairRoleSerializer(many=True)
    
    class Meta:
        model = CustomUser
       # fields = '__all__'
        fields = ["id", "first_name", "last_name", "email", "is_staff","portfolioVisibility","profileImage","portfolio","accessType","flair_roles","education"]
        read_only_fields = ["id","is_staff","portfolio","email","accessType"]
        
    def create(self, validated_data):
        # Handle user creation without roles
        roles_data = validated_data.pop('flair_roles', [])
        user = CustomUser.objects.create(**validated_data)
        for role_data in roles_data:
            flair_role = Flair_Roles.objects.create(**role_data)
            user.flair_roles.add(flair_role)
        return user

    def update(self, instance, validated_data):
        incoming_roles_data = validated_data.pop('flair_roles', None)
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.portfolioVisibility = validated_data.get('portfolioVisibility', instance.portfolioVisibility)
        instance.profileImage = validated_data.get('profileImage', instance.profileImage)
        instance.education = validated_data.get('education', instance.education)
        instance.save()

        if incoming_roles_data is not None:
            existing_roles = list(instance.flair_roles.values_list('role_name', flat=True))
            incoming_roles = [role_data['role_name'] for role_data in incoming_roles_data]

            for role_name in incoming_roles:
                if role_name not in existing_roles:
                    role, created = Flair_Roles.objects.get_or_create(role_name=role_name)
                    instance.flair_roles.add(role)
                    existing_roles.append(role_name)

            for role_name in existing_roles:
                if role_name not in incoming_roles:
                    role = Flair_Roles.objects.get(role_name=role_name)
                    instance.flair_roles.remove(role)

        return instance

    def delete(self, instance):
        # Delete all flair_roles associated with the user
        for role in instance.flair_roles.all():
            role.delete()
        # Delete the user
        instance.delete()
        return instance

class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields= ('id','icon', 'title', 'description', 'link')
        # read_only_fields = ["id","portfolio"]

    def update(self, instance, validated_data):
        instance.icon = validated_data.get('icon', instance.icon)
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.link = validated_data.get('link', instance.link)
        instance.save()
        return instance
        
class CompletePortfolioSerializer(serializers.ModelSerializer):
    items = PortfolioItemSerializer(read_only=True,many=True)
    
    class Meta:
        model = Complete_Portfolio
        fields = ('id', 'user', 'description', 'items')
        read_only_fields = ["id","user","items"]
