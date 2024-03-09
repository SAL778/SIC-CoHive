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
from rest_framework.views import APIView
from django.http import Http404
from drf_yasg.utils import swagger_auto_schema
# Create your views here.
User = get_user_model()

class ColumnsView(generics.ListAPIView):
    '''
    get:
    Get all resources.
    '''
    serializer_class = ResourcesSerializer
    queryset = Resources.objects.all()

    # def post(self, request, *args, **kwargs):
    #     # check if user have permission to add a resource
    #     user = get_user_from_token(request)
    #     if not user.is_staff and not user.is_superuser:
    #         return Response({"error": "You don't have permission to add a resource."}, status=status.HTTP_403_FORBIDDEN)
    #     serializer = self.get_serializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ColumnView(generics.RetrieveAPIView):
    '''
    get:
    Get a specific resource.
    '''
    serializer_class = ResourcesSerializer
    queryset = Resources.objects.all()
    lookup_field = 'pk'


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
        user1= get_object_or_404(User, id=user_id)
        user = get_user_from_token(request)
        if user != user1:
            return Response({"error": "You don't have permission to add a booking for another user."}, status=status.HTTP_403_FORBIDDEN)
        
        print("user below")
        print("here",user)
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ViewBookingView(APIView):
    """
    Retrieve, update or delete a booking instance.
    """
    
    def get_object(self, pk):
        try:
            return Booking.objects.get(pk=pk)
        except Booking.DoesNotExist as e:
            raise Http404

    @swagger_auto_schema(operation_description="Get a specific booking.", responses={200: BookingSerializer})
    def get(self, request, pk, format=None):
        """
        Get a specific booking.
        """
        booking = self.get_object(pk)
        serializer = BookingSerializer(booking)
        return Response(serializer.data)

    @swagger_auto_schema(operation_description="Update a specific booking.", request_body=BookingSerializer, responses={200: BookingSerializer})
    def patch(self, request, pk, format=None):
        """
        Update a specific booking.
        """
        
        booking = self.get_object(pk)
        user = get_user_from_token(request)
        if user != booking.user:
            return Response({"error": "You don't have permission to update this booking."}, status=status.HTTP_403_FORBIDDEN)
        serializer = BookingSerializer(booking, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Delete a specific booking.", responses={204: "No Content"})
    def delete(self, request, pk, format=None):
        """
        Delete a specific booking.
        """
        print("deleting booking")
        booking = self.get_object(pk)
        user = get_user_from_token(request)
        print("hello")
        
        if user != booking.user:
            print("user")
            return Response({"error": "You don't have permission to delete this booking."}, status=status.HTTP_403_FORBIDDEN)
        
        print("deleting booking")
        booking.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
