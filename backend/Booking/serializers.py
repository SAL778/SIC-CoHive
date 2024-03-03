from rest_framework import serializers
from .models import Resources, Booking
class ResourcesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resources
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    start_time = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S")
    end_time = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%S")

    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ["id","user"]