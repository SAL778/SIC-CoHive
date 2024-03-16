from django.db import models
from User.models import CustomUser
from datetime import datetime
from django.utils import timezone
from User.models import AccessType

# Create your models here.
class Resources(models.Model):
    Type=[
        ('room','Room'),
        ('equipment','Equipment'),
        ('maintenance','Maintenance'),
    #    ('other','Other')
    ]

    id = models.AutoField(primary_key=True,help_text="Unique identifier for the asset")
    name = models.CharField(max_length=100, unique=True, blank=True, null=True, help_text="Name of the asset")
    description = models.TextField(help_text="Description of the asset")
    # image = models.FilePathField(path="/resource/img", blank=True, null=True,help_text="Path to the image of the asset")
    # room_code = models.CharField(max_length=100, blank=True, null=True,help_text="Room code of the asset")
    room_number = models.CharField(max_length=100, blank=True, null=True,help_text="Room number of the asset")
    type = models.CharField(max_length=100,choices=Type,help_text="Type of the asset",default='maintenance')
    access_type=models.ManyToManyField(AccessType,help_text="The access type for the resource")   
       
    def __str__(self):
        return self.name

class Booking(models.Model):
    id = models.AutoField(primary_key=True,help_text="Unique identifier for the schedule")
    start_time = models.DateTimeField(help_text="Start time of the schedule",default=timezone.now())
    end_time = models.DateTimeField(help_text="End time of the schedule",default=timezone.now())
    resources = models.ForeignKey(Resources, on_delete=models.CASCADE,related_name='bookings',help_text="Resource that the schedule is for")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,help_text="User that the schedule is for")
    visibility = models.BooleanField(help_text="Visibility of the schedule",default=True)
    title = models.CharField(max_length=100, blank=True, null=True,help_text="Title of the schedule")
    
    
    # description = models.TextField(help_text="Description of the schedule")

    def __str__(self):
        return str(self.id)