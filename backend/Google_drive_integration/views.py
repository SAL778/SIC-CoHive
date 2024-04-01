from django.shortcuts import render
from django.http import JsonResponse
from .google_drive_api import initialize_drive_client
from .google_sheets_api import initialize_sheets_client
from .google_calendar_api import initialize_calendar_client
import datetime

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
    GOOGLE_DATE_FORMAT = "%m/%d/%Y"
    #Max events to return
    K_TO_RETURN = 7

    values = google_response["values"]
    today = datetime.date.today()
    
    headers = values[0] if firstRowAsKeyValues else scheme

    if headers:
        if len(headers) != len(values[1]):
            print(headers)
            raise ValueError(f"Scheme doesn't match the length of the data. Got {len(headers)}. Required {len(values[1])}")
    
        keyed_values = []
        for row in values[1:]:
            # keyed_values.append({header_value: row_value for header_value, row_value in zip(headers, row)})
            row_values = {header_value: row_value for header_value, row_value in zip(headers, row)}

            date_str = row_values.get("date", "")
            date_as_date = datetime.datetime.strptime(date_str, GOOGLE_DATE_FORMAT).date()
            if row_values.get("approved") == 'TRUE' and date_as_date >= today :
                keyed_values.append(row_values)         #Only return the approved events and those that come after today
                keyed_values = sorted(keyed_values, key = lambda x: x.get("date", ""))
                
        return keyed_values[:K_TO_RETURN] #Only the closest K events
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


import urllib.parse  # Import urllib.parse to decode the calendar ID

def fetch_calendar_events(request):
    print("Fetching calendar events")
    ical_url = "https://calendar.google.com/calendar/ical/6d3dcedc29c2a223c343cce8ec9ed5f309fd197f0805cb7f4bd79852d304d57c%40group.calendar.google.com/public/basic.ics"
    
    # Extract the calendar ID and decode it
    calendar_id_encoded = ical_url.split("/ical/")[1].split("/public")[0]
    calendar_id = urllib.parse.unquote(calendar_id_encoded)

    client = initialize_calendar_client()

    # fetch events for the next 30 days
    time_min = datetime.datetime.utcnow().isoformat() + 'Z'  # 'Z' indicates UTC time
    time_max = (datetime.datetime.utcnow() + datetime.timedelta(days=30)).isoformat() + 'Z'

    events_result = client.events().list(calendarId=calendar_id, timeMin=time_min, timeMax=time_max,
                                         singleEvents=True, orderBy='startTime').execute()
    print("Events Result:", events_result) 
    events = events_result.get('items', [])

    processed_events = []  # as needed by the frontend
    for event in events:
        start = event['start'].get('dateTime', event['start'].get('date'))
        end = event['end'].get('dateTime', event['end'].get('date'))
        processed_events.append({
            'summary': event.get('summary'),
            'location': event.get('location', ''),
            'description': event.get('description', ''),
            'start': start,
            'end': end
        })

    print("Processed:", processed_events)

    return JsonResponse({'events': processed_events})
