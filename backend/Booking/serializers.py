import datetime

from django.utils import timezone
from rest_framework import serializers
from .models import Resources, Booking
from rest_framework.authtoken.models import Token
from rest_framework import serializers


class BookingSerializer(serializers.ModelSerializer):
    start_time = serializers.DateTimeField(format="%Y-%m-%dT%H:%M")
    end_time = serializers.DateTimeField(format="%Y-%m-%dT%H:%M")
    user = serializers.SerializerMethodField("get_user")
    resources_name = serializers.CharField(source="resources.name", read_only=True)
    resource_type=serializers.CharField(source="resources.type", read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'start_time', 'end_time', 'resources', 'resources_name','resource_type', 'user', 'title', 'visibility']
        read_only_fields = ["id", "user", "resources_name","resource_type"]

    def validate(self, data):

        print(data['start_time'])

        if data['start_time'] > data['end_time']:
            raise serializers.ValidationError("End time must be after start time.")

        if data['start_time'].minute % 15 != 0 or data['end_time'].minute % 15 != 0:
            raise serializers.ValidationError("Time must be in 15-minute intervals.")

        # get booking objects that is in the same day and has the same resources
        overlapping_bookings = Booking.objects.filter(
            resources=data['resources'],
            start_time__date=data['start_time'].date()  # Get bookings on the same day
        ).exclude(id=self.instance.id if self.instance else None)
        print(overlapping_bookings)

        # check if the timeslot is available
        for booking in overlapping_bookings:
            if data['start_time'] < booking.end_time and data['end_time'] > booking.start_time:
                raise serializers.ValidationError("The timeslot is not available.")
        return data

    def get_user(self, obj):
        # return user info if the user is the owner of the booking or the booking is visible
        request = self.context.get("request")
        user = None
        try:
            access_token = request.META['HTTP_AUTHORIZATION'].split(' ')[1]
            token_obj = Token.objects.get(key=access_token)
            user = token_obj.user
        except:
            pass
        if user == obj.user or obj.visibility:
            user_info = {
                "id": obj.user.id,
                "first_name": obj.user.first_name,
                "last_name": obj.user.last_name,
                "email": obj.user.email,
                "profileImage": obj.user.profileImage,
            }
            return user_info
        return {}
    
    # # Removed for now, can add back if we have description
    # def to_representation(self, instance):
    #     representation = super().to_representation(instance)
    #     request = self.context.get("request")
    #     user = None
    #     try:
    #         access_token = request.META['HTTP_AUTHORIZATION']
    #         token_obj = Token.objects.get(key=access_token)
    #         user = token_obj.user
    #     except:
    #         pass
    #     if not instance.visibility and (user is None or not user.is_authenticated):
    #         representation['description'] = None
    #     return representation


class ResourcesSerializer(serializers.ModelSerializer):
    # bookings = BookingSerializer(many=True, read_only=True)
    bookings = serializers.SerializerMethodField("get_bookings")

    class Meta:
        model = Resources
        fields = ['id', 'name', 'description', 'room_number', 'type', 'bookings']

    def get_bookings(self, obj):
        request = self.context.get("request")
        date = request.query_params.get('date')
        filter_date = None
        if date is None:
            filter_date = timezone.localtime(timezone.now()).date()
        else:
            filter_date = timezone.make_aware(
                datetime.datetime.strptime(date, "%Y-%m-%d").replace(hour=0, minute=0, second=0, microsecond=0))
        bookings = Booking.objects.filter(resources=obj, start_time__date=filter_date)
        return BookingSerializer(bookings, many=True).data
