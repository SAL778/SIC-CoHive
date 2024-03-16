# Generated by Django 5.0.2 on 2024-03-16 20:02

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Booking", "0007_alter_booking_end_time_alter_booking_start_time"),
    ]

    operations = [
        migrations.AlterField(
            model_name="booking",
            name="end_time",
            field=models.DateTimeField(
                default=datetime.datetime(
                    2024, 3, 16, 20, 2, 13, 594985, tzinfo=datetime.timezone.utc
                ),
                help_text="End time of the schedule",
            ),
        ),
        migrations.AlterField(
            model_name="booking",
            name="start_time",
            field=models.DateTimeField(
                default=datetime.datetime(
                    2024, 3, 16, 20, 2, 13, 594618, tzinfo=datetime.timezone.utc
                ),
                help_text="Start time of the schedule",
            ),
        ),
    ]
