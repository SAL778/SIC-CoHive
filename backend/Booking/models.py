from urllib.parse import unquote

from django.db import models
from User.models import CustomUser
from datetime import datetime
from django.utils import timezone
from User.models import AccessType
from django.db.models import Count, Avg, ExpressionWrapper, F, fields, Sum
from django.db.models.functions import TruncDay, ExtractHour, ExtractMinute
from django.db.models.functions import ExtractWeekDay
from django.utils import timezone
from django.db.models.functions import ExtractWeek, ExtractMonth
from datetime import datetime, timedelta
from django.db.models.expressions import RawSQL
from collections import defaultdict
from collections import Counter
import heapq
from django.core.serializers.json import DjangoJSONEncoder
import json
import pytz
from django.core.cache import cache


# Create your models here.
class Resources(models.Model):
    Type = [
        ('room', 'Room'),
        ('equipment', 'Equipment'),
        ('maintenance', 'Maintenance'),
        #    ('other','Other')
    ]

    id = models.AutoField(primary_key=True, help_text="Unique identifier for the asset")
    name = models.CharField(max_length=100, unique=True, blank=True, null=True, help_text="Name of the asset")
    description = models.TextField(help_text="Description of the asset")
    # image = models.FilePathField(path="/resource/img", blank=True, null=True,help_text="Path to the image of the asset")
    room_code = models.CharField(max_length=100, blank=True, null=True, help_text="Room code of the asset")
    room_number = models.CharField(max_length=100, blank=True, null=True, help_text="Room number of the asset")
    type = models.CharField(max_length=100, choices=Type, help_text="Type of the asset", default='room')
    access_type = models.ManyToManyField(AccessType, help_text="The access type for the resource")
    image = models.URLField(max_length=100, blank=True, null=True, help_text="URL to the image of the asset")

    def __str__(self):
        return self.name


class Booking(models.Model):
    id = models.AutoField(primary_key=True, help_text="Unique identifier for the schedule")
    start_time = models.DateTimeField(help_text="Start time of the schedule")
    end_time = models.DateTimeField(help_text="End time of the schedule")
    resources = models.ForeignKey(Resources, on_delete=models.CASCADE, related_name='bookings',
                                  help_text="Resource that the schedule is for")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, help_text="User that the schedule is for")
    visibility = models.BooleanField(help_text="Visibility of the schedule", default=True)
    title = models.CharField(max_length=100, blank=True, null=True, help_text="Title of the schedule")

    # description = models.TextField(help_text="Description of the schedule")

    def get_bookingset_by_time_and_resource(scope="all", year=None, month=None, day=None, resource=None):
        bookings = Booking.objects.all()

        if scope != "all":
            if (scope == "year" or scope == "month") and year:
                bookings = bookings.filter(start_time__year=year)
            if  scope == "month" and month:
                bookings = bookings.filter(start_time__month=month)
        # bookings = bookings.annotate(day_of_week=ExtractWeekDay('start_time'))
        # bookings_per_day = bookings.values('day_of_week').annotate(count=Count('id')).order_by('day_of_week')
        # print(bookings_per_day)
        # # Get the first booking in the queryset
        # booking = bookings.first()
        #
        # # Print the start and end times of the booking
        # print(f"Start Time: {booking.start_time}")
        # print(ExtractWeekDay(booking.start_time))
        #
        # print(day,timezone.localtime(timezone.now()).weekday())
        #
        # if day:
        #     # Filter the bookings based on the day of the week
        #     bookings = bookings.annotate(weekday=ExtractWeekDay('start_time')).filter(weekday=day)
        # print(bookings)
        resource_item = None
        if resource:
            resource_item = Resources.objects.get(name=unquote(resource))
            bookings = bookings.filter(resources=resource_item)
        print(bookings, year, month, day, resource)
        return bookings, resource_item

    def resource_usage_hour(scope="all", year=None, month=None, day=None,type = None):
        cache_key = f"resource_usage_hour_{scope}_{year}_{month}_{day}_{type}"
        result = cache.get(cache_key)
        if result:
            return result

        bookings = Booking.objects.all()

        bookings, _ = Booking.get_bookingset_by_time_and_resource(scope, year, month, day)

        if type:
            bookings = bookings.filter(resources__type=type)

        # bookings = bookings.annotate(duration=F('end_time') - F('start_time'))
        # resource_usage = bookings.values('resources__name').annotate(total_duration=Sum('duration')).order_by('resources__name')
        #
        # result = []
        # for item in resource_usage:
        #     result.append({
        #         "name": item['resources__name'],
        #         "total_duration": item['total_duration'] / timedelta(hours=1)
        #     })

        resource_usage = defaultdict(int)

        for booking in bookings:
            local_start_time = booking.start_time.astimezone(pytz.timezone('America/Edmonton'))
            local_end_time = booking.end_time.astimezone(pytz.timezone('America/Edmonton'))
            duration = local_end_time - local_start_time
            if local_start_time.weekday() + 1 == day:
                resource_usage[booking.resources.name] += duration.total_seconds() / 3600

        result = []
        for key in resource_usage:
            result.append({
                "name": key,
                "total_duration": resource_usage[key]
            })
        # store the result in the cache for 5 minutes
        cache.set(cache_key, result, 60 * 5)
        return result


    def peak_booking_times(scope="all", year=None, month=None, day=None, resource=None):
        cache_key = f"peak_booking_times_{scope}_{year}_{month}_{day}_{resource}"
        result = cache.get(cache_key)
        if result:
            return result

        bookings, resource_item = Booking.get_bookingset_by_time_and_resource(scope, year, month, day, resource)
        # Initialize a dictionary with keys as hours from 8 am to 8 pm and values as 0
        hourly_bookings = {hour: 0 for hour in range(7, 22)}

        for booking in bookings:
            local_start_time = booking.start_time.astimezone(pytz.timezone('America/Edmonton'))
            local_end_time = booking.end_time.astimezone(pytz.timezone('America/Edmonton'))
            print(local_start_time.year, local_start_time.month, local_start_time.weekday())
            print(local_end_time.year, local_end_time.month, local_end_time.weekday())
            if local_start_time.weekday() + 1 == day:
                start_hour = local_start_time.hour
                end_hour = local_end_time.hour
                print(start_hour, end_hour)
                # If the start hour is between 8 and 20 (8 pm), increment the count for that hour
                for hour in range(start_hour, end_hour + 1):
                    hourly_bookings[hour] += 1

        # Convert the dictionary to a JSON object
        result = {
            "name": resource_item.name,
            "bookings": hourly_bookings
        }
        # store the result in the cache for 5 minutes
        cache.set(cache_key, result, 60 * 5)
        return result

    def average_booking_duration(scope="all", year=None, month=None, week=None):
        if year:
            bookings = Booking.objects.filter(start_time__year=year)
        if month:
            bookings = Booking.objects.filter(start_time__month=month)
        if week:
            start_of_week, end_of_week = Booking.get_week_of_month_range(int(year), int(month), int(week))
            bookings = Booking.objects.filter(start_time__date__range=(start_of_week, end_of_week))

        bookings = bookings.annotate(
            duration=ExpressionWrapper(F('end_time') - F('start_time'), output_field=fields.DurationField()))
        print(bookings)
        print("kannan")
        for booking in bookings:
            print(f"Booking ID: {booking.id}, Duration: {booking.duration}")

        avg_duration = bookings.aggregate(avg_duration=Avg('duration'))
        return avg_duration

    def __str__(self):
        return str(self.id)


class Event(models.Model):  # temperory
    id = models.AutoField(primary_key=True, help_text="Unique identifier for the event")
    start_time = models.DateTimeField(help_text="Start time of the event")
    end_time = models.DateTimeField(help_text="End time of the event")
    resources = models.ForeignKey(Resources, on_delete=models.CASCADE, related_name='events',
                                  help_text="Resource that the event is for")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, help_text="User that the event is for")
    visibility = models.BooleanField(help_text="Visibility of the event", default=True)
    title = models.CharField(max_length=100, blank=True, null=True, help_text="Title of the event")
    description = models.TextField(help_text="Description of the event")

    def __str__(self):
        return str(self.id)


class EventCalender(models.Model):  # temporary
    id = models.AutoField(primary_key=True, help_text="Unique identifier for the event calender")
    events = models.ManyToManyField(Event, help_text="Events in the calender")
    resources = models.ForeignKey(Resources, on_delete=models.CASCADE, related_name='event_calenders',
                                  help_text="Resource that the event calender is for")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, help_text="User that the event calender is for")
