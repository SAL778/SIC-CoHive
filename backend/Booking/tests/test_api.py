import datetime

from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from Booking.models import Booking
from Booking.serializers import BookingSerializer
import warnings

from User.models import CustomUser,AccessType

from Booking.models import Resources
from django.utils import timezone
from unittest.mock import patch
import datetime
import warnings

# Ignore Django naive datetime warnings
warnings.filterwarnings('ignore', 'DateTimeField .* received a naive datetime .* while time zone support is active.', RuntimeWarning)
class BookingTests(APITestCase):
    '''
    Test the booking API
    '''

    def setUp(self):
        # Create a user
        self.user = CustomUser.objects.create(
            username="testuser",
            first_name="Test",
            last_name="User",
            email="testuser@example.com",
            portfolioVisibility=True,
            profileImage="http://example.com/image.jpg",
        )

        self.resource1 = Resources.objects.create(
            name="Test Room",
            description="Test Description1",
            room_number="Test Room1",
            type="room"
        )
        self.resource1.save()
        self.resources2 = Resources.objects.create(
            name="Test Equipment",
            description="Test Description2",
            room_number="Test Room2",
            type="equipment"
        )
        self.resources2.save()
        self.accessType = AccessType.objects.create(
            name="Test")
        self.user.accessType.add(self.accessType)
        self.user.save()
        self.resource1.access_type.add(self.accessType)
        self.resource1.save()
        self.resources2.access_type.add(self.accessType)
        self.resources2.save()
        self.token = Token.objects.create(user=self.user)

    #@patch('Booking.models.timezone.now')

    def test_create_booking(self):
        '''
        Test creating a booking
        '''
        url = reverse('booking-list', kwargs={'user_id': self.user.id})  # Include user_id in URL

        # Create timezone-aware datetime objects
        start_time1 = timezone.make_aware(datetime.datetime.strptime('2030-03-25T22:45:00.000Z', "%Y-%m-%dT%H:%M:%S.%fZ"))
        end_time1 = timezone.make_aware(datetime.datetime.strptime('2030-03-25T23:30:00.000Z', "%Y-%m-%dT%H:%M:%S.%fZ"))

        data1 = {
            "start_time": start_time1,
            "end_time": end_time1,
            "resources_name": "Test Equipment",
            "visibility": True,
            "title": "Test Booking"
        }

        start_time2 = timezone.make_aware(datetime.datetime.strptime('2030-03-26T21:00:00.000Z', "%Y-%m-%dT%H:%M:%S.%fZ"))
        end_time2 = timezone.make_aware(datetime.datetime.strptime('2030-03-26T22:00:00.000Z', "%Y-%m-%dT%H:%M:%S.%fZ"))

        data2 = {
            "start_time": start_time2,
            "end_time": end_time2,
            "resources_name": "Test Equipment",
            "visibility": True,
            "title": "Test Booking"
        }

        response = self.client.post(url, data1, format='json', HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['title'], 'Test Booking')
        self.assertEqual(response.data['resources'], self.resources2.id)
        self.assertEqual(response.data['user']['id'], self.user.id)
        self.assertEqual(response.data['visibility'], True)
        self.assertEqual(response.data['start_time'], "2030-03-25T22:45")
        self.assertEqual(response.data['end_time'], "2030-03-25T23:30")

        response = self.client.post(url, data2, format='json', HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Booking.objects.count(), 2)
        
    
    def test_create_booking_invalid(self):
        '''
        Test creating a booking with invalid data
        '''
        url = reverse('booking-list', kwargs={'user_id': self.user.id})
        data = {
            "start_time": "2021-12-01T12:20",
            "end_time": "2021-12-01T13:40",
            "resources": "Test Equipment",
            "visibility": True,
            "title": "Test Booking"
        }
        data2 = {
            "start_time": "2021-12-01T13:00",
            "end_time": "2021-12-01T12:30",
            "resources": "Test Room",
            "visibility": True,
            "title": "Test Booking"
        }
        
        response = self.client.post(url, data, format='json', HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Booking.objects.count(), 0)
        response = self.client.post(url, data2, format='json', HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(Booking.objects.count(), 0)
        
    
    def test_get_booking(self):
        '''
        Test getting a booking
        '''
        booking = Booking.objects.create(
            start_time="2021-12-01T12:15",
            end_time="2021-12-01T13:00",
            resources=self.resources2,
            user=self.user,
            visibility=True,
            title="Test Booking"
        )
        booking.save()
        url = reverse('booking-detail', kwargs={'pk': booking.id})
        response=self.client.get(url, HTTP_AUTHORIZATION='Token ' + self.token.key)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'Test Booking')
        self.assertEqual(response.data['resources'], self.resources2.id)
        self.assertEqual(response.data['user']['id'], self.user.id)
        self.assertEqual(response.data['visibility'], True)
        self.assertEqual(response.data['start_time'], "2021-12-01T12:15")
        self.assertEqual(response.data['end_time'], "2021-12-01T13:00")
        
        # print(response.data)    
    

    def test_edit_booking(self):
        '''
        Test editing a booking
        '''
        start_time = timezone.make_aware(datetime.datetime.strptime('2030-03-25T22:45:00.000Z', "%Y-%m-%dT%H:%M:%S.%fZ"))
        end_time = timezone.make_aware(datetime.datetime.strptime('2030-03-25T23:30:00.000Z', "%Y-%m-%dT%H:%M:%S.%fZ"))
        booking = Booking.objects.create(
            start_time=start_time,
            end_time=end_time,
            resources=self.resources2,
            user=self.user,
            visibility=True,
            title="Test Booking"
        )
        booking.save()
        url = reverse('booking-detail', kwargs={'pk': booking.id})
        start_time = timezone.make_aware(datetime.datetime.strptime('2030-03-26T21:00:00.000Z', "%Y-%m-%dT%H:%M:%S.%fZ"))
        end_time = timezone.make_aware(datetime.datetime.strptime('2030-03-26T22:00:00.000Z', "%Y-%m-%dT%H:%M:%S.%fZ"))
        data = {
            "start_time": start_time,
            "end_time": end_time,
            "resources": 2,
            "visibility": False,
            "title": "Test Booking"
        }
        response=self.client.patch(url, data, format='json', HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['title'], 'Test Booking')
        self.assertEqual(response.data['resources'], self.resources2.id)
        self.assertEqual(response.data['user'], {})
        self.assertEqual(response.data['visibility'], False)
        self.assertEqual(response.data['start_time'], "2030-03-26T21:00")
        self.assertEqual(response.data['end_time'], "2030-03-26T22:00")

    def test_delete_booking(self):
        '''
        Test deleting a booking
        '''
        booking = Booking.objects.create(
            start_time="2021-12-01T12:15",
            end_time="2021-12-01T13:00",
            resources=self.resources2,
            user=self.user,
            visibility=True,
            title="Test Booking"
        )
        booking.save()
        url = reverse('booking-detail', kwargs={'pk': booking.id})
        response=self.client.delete(url, HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Booking.objects.count(), 0)
        
    def test_columns(self):
        '''
        Test getting columns
        '''
        url = reverse('column-list')
        response=self.client.get(url, HTTP_AUTHORIZATION='Token ' + self.token.key)
    #   print(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0]['id'], 1)
        self.assertEqual(response.data[0]['name'], 'Test Room')
        self.assertEqual(response.data[0]['description'], 'Test Description1')
        self.assertEqual(response.data[0]['type'], "room")
        self.assertEqual(response.data[1]['id'], 2)
        self.assertEqual(response.data[1]['name'], 'Test Equipment')
        self.assertEqual(response.data[1]['description'], 'Test Description2')
        self.assertEqual(response.data[1]['type'], "equipment")
        
    def test_resources(self):
        '''
        Test getting resources
        '''
        url=reverse('resource-list')
        response=self.client.get(url, HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0],{'id':2,'name':'Test Equipment'})
        self.assertEqual(response.data[1],{'id':1,'name':'Test Room'})
       
        from urllib.parse import urlencode

        base_url = reverse('resource-list')
        query_string = urlencode({'type': 'equipment'})
        url = f"{base_url}?{query_string}"
        response=self.client.get(url, HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0], {'id':2,'name':'Test Equipment'})
        self.assertEqual(len(response.data), 1)
        
        base_url = reverse('resource-list')
        query_string = urlencode({'type': 'room'})
        url = f"{base_url}?{query_string}"
        response=self.client.get(url, HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data[0], {'id':1,'name':'Test Room'})
        self.assertEqual(len(response.data), 1) 