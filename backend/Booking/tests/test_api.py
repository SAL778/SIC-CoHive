from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from Booking.models import Booking
from Booking.serializers import BookingSerializer

from User.models import CustomUser

from Booking.models import Resources


class BookingTests(APITestCase):

    def setUp(self):
        self.user = CustomUser.objects.create(
            username="testuser",
            first_name="Test",
            last_name="User",
            email="testuser@example.com",
            portfolioVisibility=True,
            profileImage="http://example.com/image.jpg",
        )
        self.user.education.field_of_study = "Computer Science"
        self.user.education.major = "Software Engineering"
        self.user.education.minor = "Data Science"
        self.user.education.save()
        self.token = Token.objects.create(user=self.user)

        self.ressource1 = Resources.objects.create(
            name="Test Room",
            description="Test Description1",
            room_number="Test Room1",
            type="room"
        )
        self.ressource1.save()
        self.resources2 = Resources.objects.create(
            name="Test Equipment",
            description="Test Description2",
            room_number="Test Room2",
            type="equipment"
        )
        self.resources2.save()


    def test_create_booking(self):
        url = reverse('booking-list', kwargs={'user_id': self.user.id})  # Include user_id in URL
        data = {
            "start_time": "2021-12-01T12:00:00Z",
            "end_time": "2021-12-01T13:00:00Z",
            "resources": 1,
            "visibility": True,
            "title": "Test Booking"
        }

        response = self.client.post(url, data, format='json', HTTP_AUTHORIZATION='Token ' + self.token.key)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Booking.objects.count(), 1)
        self.assertEqual(Booking.objects.get().title, 'Test Booking')
