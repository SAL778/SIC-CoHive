# Generated by Django 5.0.2 on 2024-03-18 09:49

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Booking', '0013_alter_booking_end_time_alter_booking_start_time_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='booking',
            name='end_time',
            field=models.DateTimeField(default=datetime.datetime(2024, 3, 18, 9, 49, 21, 121748, tzinfo=datetime.timezone.utc), help_text='End time of the schedule'),
        ),
        migrations.AlterField(
            model_name='booking',
            name='start_time',
            field=models.DateTimeField(default=datetime.datetime(2024, 3, 18, 9, 49, 21, 121748, tzinfo=datetime.timezone.utc), help_text='Start time of the schedule'),
        ),
    ]