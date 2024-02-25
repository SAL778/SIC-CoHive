from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import CustomUser, Education
from .serializers import CustomUserSerializer, EducationSerializer


class CustomUserTestCase(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            username="testuser",
            first_name="Test",
            last_name="User",
            email="testuser@example.com",
            portfolioVisibility=True,
            profileImage="http://example.com/image.jpg",

        )
        self.education = Education.objects.create(
            user=self.user,
            field_of_study="Computer Science",
            major="Software Engineering",
            minor="Data Science"
        )
        self.user.education = self.education