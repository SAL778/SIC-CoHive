from django.db import models

# Create your models here.
class Assets(models.Model):
    Type={
        ('room','Room'),
        ('equipment','Equipment'),
        ('other','Other')
    }

    id = models.AutoField(primary_key=True,help_text="Unique identifier for the asset")
    name = models.CharField(max_length=100, blank=True, null=True,help_text="Name of the asset")
    description = models.TextField(help_text="Description of the asset")
    image = models.FilePathField(path="/assets/img", blank=True, null=True,help_text="Path to the image of the asset")
    room_number = models.CharField(max_length=100, blank=True, null=True,help_text="Room number of the asset")
    type = models.CharField(max_length=100,choices=Type, blank=True, null=True,help_text="Type of the asset")

    def __str__(self):
        return self.name

class Schedule(models.Model):
    id = models.AutoField(primary_key=True,help_text="Unique identifier for the schedule")
    start_time = models.DateTimeField(format('%Y-%m-%d %H:%M:%S'),help_text="Start time of the schedule")
    end_time = models.DateTimeField(format('%Y-%m-%d %H:%M:%S'),help_text="End time of the schedule")
    asset = models.ForeignKey(Assets, on_delete=models.CASCADE,help_text="Asset that the schedule is for")
    user = models.ForeignKey('User.CustomUser', on_delete=models.CASCADE,help_text="User that the schedule is for")

    def __str__(self):
        return self.id