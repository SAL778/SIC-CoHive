from django.shortcuts import render

# Create your views here.


from django.shortcuts import render, HttpResponse
from rest_framework import generics
from .models import CustomUser
from .serializers import CustomUserSerializer


def index(request):
    return HttpResponse("Hello, world. You're at the User index.")


# Create your views here.

class UserList(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

