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
from urllib.parse import unquote

# Create your views here.
User = get_user_model()

def match_access_type(user, resource):
    '''
    Check if the user has access to the resource.
    '''
    user_access_type = user.accessType.all()
    resource_access_type = resource.access_type.all()
    for access_type in user_access_type:
        if access_type in resource_access_type:
            return True
    return False

class ColumnsView(generics.ListAPIView):
    '''
    get:
    Get all resources. Example: /bookings/columns/filter?type=room&date=YYYY-MM-DD
    '''
    serializer_class = ResourcesSerializer

    def get_queryset(self):
        type = self.request.query_params.get('type')
        if type is not None:
            return Resources.objects.filter(type=type)
        return Resources.objects.all()


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
    Get all bookings that fall within the given date range. Example: /booking/filter?start_time=YYYY-MM-DD&end_time=YYYY-MM-DD
    New Example: /booking/filter?start_time=YYYY-MM-DD&end_time=YYYY-MM-DD&room=room1&room=room2
    '''
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def get_queryset(self, start_time=None, end_time=None):
        queryset = super().get_queryset()
        start_time = self.request.query_params.get('start_time')
        end_time = self.request.query_params.get('end_time')
        resources = self.request.query_params.getlist('resource')

        # print("hereeee", resources)
        if start_time:
            queryset = queryset.filter(start_time__gte=start_time)
        if end_time:
            queryset = queryset.filter(end_time__lte=end_time)
        if resources:
            decoded_resources = [unquote(resource) for resource in resources]
            queryset = queryset.filter(resources__name__in=decoded_resources)
            # queryset = queryset.filter(resources_name__in=rooms)

        return queryset

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
        # return Response(self.get_serializer(Booking.objects.filter(start_time__gte=start_time, end_time__lte=end_time),
                                            # many=True).data)
        return Response(self.get_serializer(self.get_queryset(), many=True).data)


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
        user1 = get_object_or_404(User, id=user_id)
        user = get_user_from_token(request)
        if user != user1:
            return Response({"error": "You don't have permission to add a booking for another user."},
                            status=status.HTTP_403_FORBIDDEN)

        # Extract resource name from request data
        resource_name = request.data.get('resources_name')
        # Get the resource object with this name
        resource = Resources.objects.filter(name=resource_name).first()
        print(request.data)
        if not resource:
            return Response({"error": f"No resource found with name {resource_name}."},
                            status=status.HTTP_400_BAD_REQUEST)
        access=match_access_type(user, resource)
        # Add the resource's ID to the request data, front end only sends the name
        
        if access:
            request.data['resources'] = resource.id
            
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():   
                serializer.save(user=user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "You don't have permission to add a booking for this resource."},
                            status=status.HTTP_403_FORBIDDEN)


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

    @swagger_auto_schema(operation_description="Update a specific booking.", request_body=BookingSerializer,
                         responses={200: BookingSerializer})
    def patch(self, request, pk, format=None):
        """
        Update a specific booking.
        """

        booking = self.get_object(pk)
        user = get_user_from_token(request)
        if user != booking.user:
            return Response({"error": "You don't have permission to update this booking."},
                            status=status.HTTP_403_FORBIDDEN)
        resource=Resources.objects.get(id=booking.resources.id)
        access=match_access_type(user, resource)
        if access:
            serializer = BookingSerializer(booking, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "You don't have permission to update this booking."},
                            status=status.HTTP_403_FORBIDDEN)

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
            return Response({"error": "You don't have permission to delete this booking."},
                            status=status.HTTP_403_FORBIDDEN)

        print("deleting booking")
        booking.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ResourceListView(generics.ListAPIView):
    '''
    get:
    Get all resources name with filter by type. Example: /bookings/resources/filter?type=room
    '''
    serializer_class = ResourcesSerializer

    def get_queryset(self):
        type = self.request.query_params.get('type')
        if type is not None:
            return Resources.objects.filter(type=type)
        return Resources.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        names_and_ids = queryset.values('id', 'name')
        return Response(list(names_and_ids))
    
    
