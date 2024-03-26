import os
from googleapiclient.discovery import build
from google.oauth2 import service_account

'''
Initialize the Google Drive API using a service account.

Usage: In theory, you can import `drive_service` and directly call methods on the client
The methods callable are as specified here:
https://developers.google.com/sheets/api/guides/values
    ...any additional apis we want to add here.

In the future, we can replace this with the SIC enterprise account directly.
'''

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

#Get the credentials from the JSON in "credentials"
current_dir = os.path.dirname(os.path.abspath(__file__))
#SERVICE_ACCOUNT = './credentials/service_credentials.json'
SERVICE_ACCOUNT = os.path.join(current_dir, 'credentials', 'service_credentials.json')

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT,
    scopes = SCOPES
)

#Initialize the API Client
def initialize_sheets_client():
    drive_service = build('sheets', 'v4', credentials=credentials)
    return drive_service