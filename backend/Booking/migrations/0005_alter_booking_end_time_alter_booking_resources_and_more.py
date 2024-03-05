# Generated by Django 5.0.2 on 2024-03-05 21:12

import datetime
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Booking", "0004_remove_resources_image_alter_booking_end_time_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="booking",
            name="end_time",
            field=models.DateTimeField(
                default=datetime.datetime(
                    2024, 3, 5, 21, 12, 26, 651586, tzinfo=datetime.timezone.utc
                ),
                help_text="End time of the schedule",
            ),
        ),
        migrations.AlterField(
            model_name="booking",
            name="resources",
            field=models.ForeignKey(
                help_text="Resource that the schedule is for",
                on_delete=django.db.models.deletion.CASCADE,
                related_name="bookings",
                to="Booking.resources",
            ),
        ),
        migrations.AlterField(
            model_name="booking",
            name="start_time",
            field=models.DateTimeField(
                default=datetime.datetime(
                    2024, 3, 5, 21, 12, 26, 651430, tzinfo=datetime.timezone.utc
                ),
                help_text="Start time of the schedule",
            ),
        ),
    ]
