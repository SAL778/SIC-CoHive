from django.urls import path
from django.views.generic import RedirectView

from . import views

urlpatterns = [
    path('events', views.fetch_spreadsheet_events, name='google-get-events'),
    path('calendar-events', views.fetch_calendar_events, name='google-calendar-events'),
]