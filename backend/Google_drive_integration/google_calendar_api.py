
import os
from googleapiclient.discovery import build
from google.oauth2 import service_account

SCOPES = ['https://www.googleapis.com/auth/calendar.readonly']
# SCOPES = ['https://www.googleapis.com/auth/calendar']

current_dir = os.path.dirname(os.path.abspath(__file__))
SERVICE_ACCOUNT = os.path.join(current_dir, 'credentials', 'service_credentials.json')

def initialize_calendar_client():
    credentials = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT, scopes=SCOPES)
    return build('calendar', 'v3', credentials=credentials)
