from django.urls import path
from django.views.generic import RedirectView

from . import views

urlpatterns = [
    path('files', views.fetch_drive_files, name='google-drive-get-files'),
    path('events', views.fetch_spreadsheet_events, name='google-get-events'),
]