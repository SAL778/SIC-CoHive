# Generated by Django 5.0.2 on 2024-03-21 21:09

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Booking", "0014_alter_booking_end_time_alter_booking_start_time"),
    ]

    operations = [
        migrations.AddField(
            model_name="resources",
            name="image",
            field=models.URLField(
                blank=True,
                help_text="URL to the image of the asset",
                max_length=100,
                null=True,
            ),
        ),
        migrations.AlterField(
            model_name="booking",
            name="end_time",
            field=models.DateTimeField(
                default=datetime.datetime(
                    2024, 3, 21, 21, 9, 40, 418667, tzinfo=datetime.timezone.utc
                ),
                help_text="End time of the schedule",
            ),
        ),
        migrations.AlterField(
            model_name="booking",
            name="start_time",
            field=models.DateTimeField(
                default=datetime.datetime(
                    2024, 3, 21, 21, 9, 40, 418282, tzinfo=datetime.timezone.utc
                ),
                help_text="Start time of the schedule",
            ),
        ),
        migrations.AlterField(
            model_name="resources",
            name="type",
            field=models.CharField(
                choices=[
                    ("room", "Room"),
                    ("equipment", "Equipment"),
                    ("maintenance", "Maintenance"),
                ],
                default="room",
                help_text="Type of the asset",
                max_length=100,
            ),
        ),
    ]
