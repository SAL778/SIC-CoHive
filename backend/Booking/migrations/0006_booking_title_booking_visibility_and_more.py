# Generated by Django 5.0.2 on 2024-03-07 21:36

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Booking", "0005_alter_booking_end_time_alter_booking_resources_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="booking",
            name="title",
            field=models.CharField(
                blank=True, help_text="Title of the schedule", max_length=100, null=True
            ),
        ),
        migrations.AddField(
            model_name="booking",
            name="visibility",
            field=models.BooleanField(
                default=True, help_text="Visibility of the schedule"
            ),
        ),
        migrations.AlterField(
            model_name="booking",
            name="end_time",
            field=models.DateTimeField(
                default=datetime.datetime(
                    2024, 3, 7, 21, 36, 14, 809652, tzinfo=datetime.timezone.utc
                ),
                help_text="End time of the schedule",
            ),
        ),
        migrations.AlterField(
            model_name="booking",
            name="start_time",
            field=models.DateTimeField(
                default=datetime.datetime(
                    2024, 3, 7, 21, 36, 14, 809237, tzinfo=datetime.timezone.utc
                ),
                help_text="Start time of the schedule",
            ),
        ),
        migrations.AlterField(
            model_name="resources",
            name="type",
            field=models.CharField(
                blank=True,
                choices=[("room", "Room"), ("equipment", "Equipment")],
                help_text="Type of the asset",
                max_length=100,
                null=True,
            ),
        ),
    ]
