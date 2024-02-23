from django.shortcuts import get_object_or_404, render
from django.shortcuts import render, HttpResponse
from rest_framework import generics
from .models import CustomUser, Complete_Portfolio, PortfolioItem
from .serializers import CustomUserSerializer, PortfolioItemSerializer


def index(request):
    return HttpResponse("Hello, world. You're at the User index.")


# Create your views here.

class UserList(generics.ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    
    
    
class CompletePortfolioDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PortfolioItemSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        print(user_id)
        return Complete_Portfolio.objects.filter(user_id=user_id)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, pk=self.kwargs['pk'])
        return obj

    def perform_create(self, serializer):
        serializer.save(user_id=self.kwargs['user_id'])


   