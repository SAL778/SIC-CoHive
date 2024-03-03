from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics

from .models import Assets, Schedule
from .serializers import AssetsSerializer, ScheduleSerializer
# Create your views here.

def index(request):
    return HttpResponse("Hello, world. You're at the booking index.")


class ScheduleList(generics.ListCreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer