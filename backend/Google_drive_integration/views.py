from django.shortcuts import render
from django.http import JsonResponse
from .google_drive_api import initialize_drive_client

# Create your views here.

def fetch_drive_files(request):
    client = initialize_drive_client()

    files_list = client.files().list(
        corpora = 'allDrives',
        includeItemsFromAllDrives = True,
        supportsAllDrives = True 
        ).execute()

    print(files_list)

    #file_names = [file['name'] for file in files_list]

    return JsonResponse({'files' : files_list})