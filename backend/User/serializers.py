from rest_framework import serializers
from .models import CustomUser, Complete_Portfolio, PortfolioItem, Education_Field, AccessType

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education_Field
        fields = ('field_of_study', 'major', 'minor')
class AccessTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessType
        fields = ['name']
class CustomUserSerializer(serializers.ModelSerializer):
    education = EducationSerializer(required=False)
    accessType = AccessTypeSerializer(read_only=True, many=True)
    
    class Meta:
        model = CustomUser
       # fields = '__all__'
        fields = ["id", "first_name", "last_name", "email","roles", "is_staff","portfolioVisibility","profileImage","portfolio","education","accessType"]
        read_only_fields = ["id","is_staff","portfolio","email","accessType"]
        
    # def create(self, validated_data):
    #     education_data = validated_data.pop('education', None)
    #     user = CustomUser.objects.create(**validated_data)
    #     if education_data is not None:
    #         Education_Field.objects.create(user=user, **education_data)
    #     return user

    def update(self, instance, validated_data):

        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.portfolioVisibility = validated_data.get('portfolioVisibility', instance.portfolioVisibility)
        instance.profileImage = validated_data.get('profileImage', instance.profileImage)

        # Update education if education data is provided
        education_data = validated_data.get('education')
        if education_data is not None:
            education = instance.education
            # if education is None:
            #     education = Education_Field.objects.create(user=instance)
            # else:
            #     education = Education_Field.objects.get(user=instance)
            education.field_of_study = education_data.get('field_of_study', education.field_of_study)
            education.major = education_data.get('major', education.major)
            education.minor = education_data.get('minor', education.minor)
            education.save()
        instance.save()
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
    items = PortfolioItemSerializer(many=True)
    
    class Meta:
        model = Complete_Portfolio
        fields = ('id', 'user', 'description', 'items')
        read_only_fields = ["id","user"]
