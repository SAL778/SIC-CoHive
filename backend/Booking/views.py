from rest_framework import generics, status
from rest_framework.response import Response
from .models import Resources, Booking
from django.contrib.auth import get_user_model
from .serializers import BookingSerializer, ResourcesSerializer
from django.shortcuts import get_object_or_404
from .models import Resources, Booking
from .serializers import ResourcesSerializer,BookingSerializer
from django.contrib.auth import get_user_model

# Create your views here.
User = get_user_model()
class AddResourcesView(generics.CreateAPIView):
    queryset = Resources.objects.all()
    serializer_class = ResourcesSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class allBookingsView(generics.ListAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer







class CreateBookingView(generics.CreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def post(self, request, *args, **kwargs):
        user_id = kwargs.get('user_id')
        user = get_object_or_404(User, id=user_id)

        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ViewBookingView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    lookup_field = 'pk'