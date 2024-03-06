from rest_framework import serializers
from .models import Resources, Booking
from rest_framework.authtoken.models import Token
from rest_framework import serializers

def validate_time_interval(value):
    if value.minute % 15 != 0:
        raise serializers.ValidationError("Time must be in 15-minute intervals.")
    return value

class BookingSerializer(serializers.ModelSerializer):
    start_time = serializers.DateTimeField(format="%Y-%m-%dT%H:%M", validators=[validate_time_interval])
    end_time = serializers.DateTimeField(format="%Y-%m-%dT%H:%M", validators=[validate_time_interval])
    user = serializers.SerializerMethodField("get_user")

    class Meta:
        model = Booking
        fields = ['id', 'start_time', 'end_time', 'resources', 'user', 'title']
        read_only_fields = ["id","user"]

    def validate(self, data):
        if data['start_time'] >= data['end_time']:
            raise serializers.ValidationError("End time must be after start time.")
        return data

    def get_user(self, obj):
        request = self.context.get("request")
        user = None
        try:
            access_token = request.META['HTTP_AUTHORIZATION']
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
    bookings = BookingSerializer(many=True, read_only=True)
    class Meta:
        model = Resources
        fields = ['id', 'name', 'description', 'room_number', 'type', 'bookings']