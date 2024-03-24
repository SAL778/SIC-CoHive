from django.shortcuts import render
from django.http import JsonResponse
from .google_drive_api import initialize_drive_client
from .google_sheets_api import initialize_sheets_client

# Create your views here.

def fetch_drive_files(request):
    client = initialize_drive_client()
    event_image_folder_id = '18Wr9QurCVBnCfcoKVUdXR50Ox4e_yAqBtr-AZm6GPhJjzyQuz_-IaOC5GL0FCQIwYgksxbs1'

    q=f"'{event_image_folder_id}' in parents"

    files_list = client.files().list(
        corpora = 'allDrives',
        q = q,
        includeItemsFromAllDrives = True,
        supportsAllDrives = True 
        ).execute()

    #The image src can be gotten here:
    #"https://drive.google.com/uc?id=..."
 
    return JsonResponse({'files': files_list})



def parse_spreadsheet(google_response, firstRowAsKeyValues:bool = False, scheme:list = None):
    '''
    Parse a spreadsheet and return a list of rows, represented as a dictionary mapping header value to cell value.

    Keyword arguments:
    google_response: The spreadsheet response from the Google Sheets API
    scheme (list): Ignores the firstRowAsKeyValues argument, and names the values in the sheet according to the scheme.
            -- This is done to avoid inconsistencies between the sheet and frontend.
            -- e.g) ["title", "date", "start_time", "end_time", "location"]
    firstRowAsKeyValues (boolean): Whether or not to provide key values to the values in the spreadsheet.
    '''

    values = google_response["values"]
    headers = values[0] if firstRowAsKeyValues else scheme

    if headers:
        if len(headers) != len(values[1]):
            print(headers)
            raise ValueError(f"Scheme doesn't match the length of the data. Got {len(headers)}. Required {len(values[1])}")
    
        keyed_values = []
        for row in values[1:]:
            keyed_values.append({header_value: row_value for header_value, row_value in zip(headers, row)})

        return keyed_values
    else:
        return values[1:]

def fetch_spreadsheet_events(request):
    client = initialize_sheets_client()

    spreadsheet_id = "15hVD2EytHBED3Ie6QzL8NrnEDWsNfrPHb7JggMgRdFw"
    spreadsheet_range = "Events!A1:Z" #Rows 2 onwards (Row 1 is headers), from columns A-Z. Empty columns will not be included, even if specified in range.
    scheme = ["timestamp", "title", "date", "startTime", "endTime", "imgSrc", "description", "email", "location", "approved"] #Camelcasing to follow google convention

    event_entries = client.spreadsheets().values().get(spreadsheetId = spreadsheet_id, range=spreadsheet_range).execute()
    parsed_events = parse_spreadsheet(event_entries, scheme=scheme)

    return JsonResponse({'events': parsed_events})