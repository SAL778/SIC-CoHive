from urllib.parse import unquote

from django.db import models
from User.models import CustomUser
from datetime import datetime
from django.utils import timezone
from User.models import AccessType
from django.db.models import Count, Avg, ExpressionWrapper, F, fields
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

    def get_week_of_month_range(year, month, week_number, week_start=0):
        """
        Calculate the start and end date of the nth week of a specific month.
        
        :param year: The year
        :param month: The month
        :param week_number: The week number within the month (1-based)
        :param week_start: The day the week starts on, where 0 is Monday and 6 is Sunday (default: 0)
        :return: A tuple of (start_date, end_date)
        """

        first_day = datetime(year, month, 1)

        days_ahead = (week_start - first_day.weekday()) % 7
        start_of_first_week = first_day + timedelta(days=days_ahead)

        if week_number == 1 and days_ahead > 0:
            start_of_week = start_of_first_week - timedelta(days=7)
        else:
            start_of_week = start_of_first_week + timedelta(days=(week_number - 1) * 7)

        end_of_week = start_of_week + timedelta(days=6)

        return start_of_week, end_of_week

    def get_bookings_by_day_of_week(scope='all', year=None, month=None, week=None):
        bookings = Booking.objects.all()

        if year:
            bookings = bookings.filter(start_time__year=year)
        if month:
            bookings = bookings.filter(start_time__month=month)

        if scope == 'week' and week:
            start_of_week, end_of_week = Booking.get_week_of_month_range(int(year), int(month), int(week))
            bookings = bookings.filter(start_time__date__range=(start_of_week, end_of_week))

        bookings_by_day = bookings.annotate(
            day_of_week=ExtractWeekDay('start_time')
        ).values('day_of_week').annotate(
            total=Count('id')
        ).order_by('day_of_week')

        day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        readable_bookings = {day_names[day['day_of_week'] - 1]: day['total'] for day in bookings_by_day}

        return readable_bookings

    def booking_frequencies_by_resource(scope="all", year=None, month=None, week=None):
        bookings = Booking.objects.all()

        if year:
            bookings = bookings.filter(start_time__year=year)
            print(bookings)
        if month:
            bookings = bookings.filter(start_time__month=month)

        if week:
            # Assuming you have a similar method to `get_week_of_month_range` for calculating the week range
            start_of_week, end_of_week = Booking.get_week_of_month_range(int(year), int(month), int(week))
            bookings = bookings.filter(start_time__date__range=(start_of_week, end_of_week))

        frequencies = bookings.values('resources__name').annotate(count=Count('id')).order_by('-count')
        print(frequencies)
        return frequencies



    def peak_booking_times(scope="all", year=None, month=None, day=None, resource=None):
        bookings = Booking.objects.all()
        print(bookings)
        if year:
            bookings = bookings.filter(start_time__year=year)
        if month:
            bookings = bookings.filter(start_time__month=month)
        print(bookings)
        bookings = bookings.annotate(day_of_week=ExtractWeekDay('start_time'))
        bookings_per_day = bookings.values('day_of_week').annotate(count=Count('id')).order_by('day_of_week')
        print(bookings_per_day)
        # Get the first booking in the queryset
        booking = bookings.first()

        # Print the start and end times of the booking
        print(f"Start Time: {booking.start_time}")


        if day:
            bookings = bookings.filter(start_time__week_day=day)



        if resource:
            resource_item = Resources.objects.get(name=unquote(resource))
            bookings = bookings.filter(resources=resource_item)
        print(bookings,year,month,day,resource)

        bookings = bookings.annotate(start_hour=ExtractHour('start_time'), start_minute=ExtractMinute('start_time'),
                                     end_hour=ExtractHour('end_time'), end_minute=ExtractMinute('end_time'))

        # Initialize a dictionary with keys as hours from 8 am to 8 pm and values as 0
        hourly_bookings = {hour: 0 for hour in range(8, 21)}

        for booking in bookings:
            start_hour = booking.start_hour
            # If the start hour is between 8 and 20 (8 pm), increment the count for that hour
            if 8 <= start_hour < 21:
                hourly_bookings[start_hour] += 1

        # Convert the dictionary to a JSON object
        result = {
            "name": resource_item.name,
            "bookings": hourly_bookings
        }
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
