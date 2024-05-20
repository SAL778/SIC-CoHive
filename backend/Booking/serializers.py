import datetime
from django.utils import timezone
from rest_framework import serializers
from .models import Resources, Booking
from rest_framework.authtoken.models import Token
from rest_framework import serializers


class BookingSerializer(serializers.ModelSerializer):
    start_time = serializers.DateTimeField(format="%Y-%m-%dT%H:%M",default=timezone.localtime(timezone.now()))
    end_time = serializers.DateTimeField(format="%Y-%m-%dT%H:%M",default=timezone.localtime(timezone.now()))
    user = serializers.SerializerMethodField("get_user")
    resources_name = serializers.CharField(source="resources.name", read_only=True)
    resource_type=serializers.CharField(source="resources.type", read_only=True)
    resource_room_code=serializers.CharField(source="resources.room_code", read_only=True)
    resource_description=serializers.CharField(source="resources.description", read_only=True)
    resource_access_type=serializers.StringRelatedField(source="resources.access_type", read_only=True,many=True)

    class Meta:
        model = Booking
        fields = ['id', 'start_time', 'end_time', 'resources', 'resources_name','resource_type', 'user', 'title', 'visibility','resource_room_code','resource_description','resource_access_type']
        read_only_fields = ["id", "user", "resources_name","resource_type","resource_room_code","resource_description","resource_access_type"]

    def validate(self, data):

        print("date: ",data['start_time'])
        print("time: ",timezone.localtime(timezone.now()))

        if data['start_time'] > data['end_time']:
            raise serializers.ValidationError("End time must be after start time.")

        if data['start_time'].minute % 15 != 0 or data['end_time'].minute % 15 != 0:
            raise serializers.ValidationError("Time must be in 15-minute intervals.")

        if data['start_time'] < timezone.localtime(timezone.now()):
            raise serializers.ValidationError("Start time must be in the future.")

        if data['end_time'] < timezone.localtime(timezone.now()):
            raise serializers.ValidationError("End time must be in the future.")

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
    
    


class ResourcesSerializer(serializers.ModelSerializer):
    # bookings = BookingSerializer(many=True, read_only=True)
    bookings = serializers.SerializerMethodField("get_bookings")
    access_type = serializers.StringRelatedField(many=True)

    class Meta:
        model = Resources
        fields = ['id', 'name', 'description', 'room_number', 'type', 'bookings', 'access_type', 'image','room_code']
        read_only_fields = ['id', 'bookings', 'access_type','room_code']

    def parse_date_with_formats(self, date_str, formats):
        for formatd in formats:
            try:
                return datetime.datetime.strptime(date_str, formatd)
            except ValueError:
                continue  # Try the next format
        # If no format matched
        raise ValueError("No valid date format found for input: {}".format(date_str))

    def get_bookings(self, obj):
        request = self.context.get("request")
        date = request.query_params.get('date')
        filter_date = None
        if date is None:
            filter_date = timezone.localtime(timezone.now()).date()
        else:
            # List of expected date formats
            expected_formats = ["%Y-%m-%d", "%m/%d/%Y"]  # Adjust formats as needed

            # Print the date for debugging
            print("date: ", date)

            # Attempt to parse the date using the expected formats
            parsed_date = self.parse_date_with_formats(date, expected_formats)

            # Make the parsed datetime timezone aware and set time to beginning of the day
            filter_date = timezone.make_aware(parsed_date.replace(hour=0, minute=0, second=0, microsecond=0))

        bookings = Booking.objects.filter(resources=obj, start_time__date=filter_date)
        return BookingSerializer(bookings, many=True, context={'request': request}).data

    
class BookingFrequencyFilterSerializer(serializers.Serializer):
    resource = serializers.CharField(required=True)
    scope = serializers.ChoiceField(choices=['all', 'day', 'month', 'year'], required=False, default='all')
    year = serializers.IntegerField(required=False, min_value=2000, max_value=2100, default=timezone.localtime(timezone.now()).year)
    month = serializers.IntegerField(required=False, min_value=1, max_value=12, default=timezone.localtime(timezone.now()).month)
    day = serializers.IntegerField(required=False, min_value=1, max_value=7, default=timezone.localtime(timezone.now()).weekday() + 1)

class ResourceUsageHourSerializer(serializers.Serializer):
    type = serializers.CharField(required=True)
    scope = serializers.ChoiceField(choices=['all', 'day', 'month', 'year'], required=False, default='month')
    year = serializers.IntegerField(required=False, min_value=2000, max_value=2100, default=timezone.localtime(timezone.now()).year)
    month = serializers.IntegerField(required=False, min_value=1, max_value=12, default=timezone.localtime(timezone.now()).month)
    day = serializers.IntegerField(required=False, min_value=1, max_value=7, default=timezone.localtime(timezone.now()).weekday() + 1)
