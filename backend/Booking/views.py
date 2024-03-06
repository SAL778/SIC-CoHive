import datetime
from datetime import timedelta
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Resources, Booking
from django.contrib.auth import get_user_model
from .serializers import BookingSerializer, ResourcesSerializer
from django.shortcuts import get_object_or_404
from .models import Resources, Booking
from .serializers import ResourcesSerializer, BookingSerializer
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from User.views import get_user_from_token


# Create your views here.
User = get_user_model()


class ResourcesView(generics.ListCreateAPIView):
    '''
    post:
    Add a new resource
    '''
    queryset = Resources.objects.all()
    serializer_class = ResourcesSerializer

    def post(self, request, *args, **kwargs):
        # check if user have permission to add a resource
        user = get_user_from_token(request)
        if not user.is_staff and not user.is_superuser:
            return Response({"error": "You don't have permission to add a resource."}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AllBookingsView(generics.ListAPIView):
    '''
    get:
    Get all bookings.
    '''
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


class FilterBookingsView(generics.ListAPIView):
    '''
    get:
    Get all bookings that fall within the given date range.
    '''
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get(self, request, *args, **kwargs):
        start_time = request.query_params.get('start_time')
        end_time = request.query_params.get('end_time')

        # Check if both start_time and end_time are either None or have a value
        if (start_time is None) != (end_time is None):
            raise ValidationError("Both start_time and end_time should either be None or have a value.")

        # If start_date and end_date are not provided, set them to the current day
        if start_time is None:
            start_time = timezone.localtime(timezone.now()).replace(hour=0, minute=0, second=0, microsecond=0)
        else:
            start_time = timezone.make_aware(
                datetime.datetime.strptime(start_time, "%Y-%m-%d").replace(hour=0, minute=0, second=0, microsecond=0))

        if end_time is None:
            end_time = timezone.localtime(timezone.now()).replace(hour=23, minute=59, second=59, microsecond=999999)
        else:
            end_time = timezone.make_aware(
                datetime.datetime.strptime(end_time, "%Y-%m-%d").replace(hour=23, minute=59, second=59,
                                                                         microsecond=999999))

        print(start_time, end_time)
        return Response(self.get_serializer(Booking.objects.filter(start_time__gte=start_time, end_time__lte=end_time),
                                            many=True).data)


class UserBookingView(generics.ListCreateAPIView):
    '''
    get:
    Get all bookings for a specific user.
    post:
    Add a new booking for a specific user.
    '''
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Booking.objects.filter(user_id=user_id)

    def post(self, request, *args, **kwargs):
        user_id = kwargs.get('user_id')
        user = get_object_or_404(User, id=user_id)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ViewBookingView(generics.RetrieveUpdateDestroyAPIView):
    '''
    get:
    Get a specific booking.
    put:
    Update a specific booking.
    delete:
    Delete a specific booking.
    '''
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    lookup_field = 'pk'
