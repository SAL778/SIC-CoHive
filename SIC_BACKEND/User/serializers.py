from rest_framework import serializers
from .models import CustomUser, Complete_Portfolio, PortfolioItem,Education,AccessType

class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
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
        
    def create(self, validated_data):
        education_data = validated_data.pop('education', None)
        user = CustomUser.objects.create(**validated_data)
        if education_data is not None:
            Education.objects.create(user=user, **education_data)
        return user

    def update(self, instance, validated_data):
        education_data = validated_data.pop('education', None)

        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.is_active = validated_data.get('is_active', instance.is_active)
        instance.portfolioVisibility = validated_data.get('portfolioVisibility', instance.portfolioVisibility)
        instance.profileImage = validated_data.get('profileImage', instance.profileImage)
        instance.save()

        if education_data is not None:
            # Check if education object exists, otherwise create it
            education_instance, _ = Education.objects.get_or_create(user=instance)
            education_instance.field_of_study = education_data.get('field_of_study', education_instance.field_of_study)
            education_instance.major = education_data.get('major', education_instance.major)
            education_instance.minor = education_data.get('minor', education_instance.minor)
            education_instance.save()

        return instance
        

class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields= ('id','icon', 'title', 'description', 'link')
        # read_only_fields = ["id","portfolio"]
        
class CompletePortfolioSerializer(serializers.ModelSerializer):
    items = PortfolioItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Complete_Portfolio
        
        fields = ('id', 'user', 'description', 'items')
        read_only_fields = ["id","user","items"]
        
        
    # def create(self, validated_data):
    #     items_data = validated_data.pop('items')
    #     portfolio = Complete_Portfolio.objects.create(**validated_data)
    #     for item_data in items_data:
    #         PortfolioItem.objects.create(portfolio=portfolio, **item_data)
    #     return portfolio
  
    
    
        
        


