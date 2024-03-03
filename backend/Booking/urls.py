from django.urls import path
from . import views

urlpatterns = [
    path("", views.ScheduleList.as_view(), name="schedule-list"),

]