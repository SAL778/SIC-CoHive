# Generated by Django 4.2.9 on 2024-03-25 16:49

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Booking', '0017_alter_booking_end_time_alter_booking_start_time'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.AutoField(help_text='Unique identifier for the event', primary_key=True, serialize=False)),
                ('start_time', models.DateTimeField(help_text='Start time of the event')),
                ('end_time', models.DateTimeField(help_text='End time of the event')),
                ('visibility', models.BooleanField(default=True, help_text='Visibility of the event')),
                ('title', models.CharField(blank=True, help_text='Title of the event', max_length=100, null=True)),
                ('description', models.TextField(help_text='Description of the event')),
                ('resources', models.ForeignKey(help_text='Resource that the event is for', on_delete=django.db.models.deletion.CASCADE, related_name='events', to='Booking.resources')),
                ('user', models.ForeignKey(help_text='User that the event is for', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='EventCalender',
            fields=[
                ('id', models.AutoField(help_text='Unique identifier for the event calender', primary_key=True, serialize=False)),
                ('events', models.ManyToManyField(help_text='Events in the calender', to='Booking.event')),
                ('resources', models.ForeignKey(help_text='Resource that the event calender is for', on_delete=django.db.models.deletion.CASCADE, related_name='event_calenders', to='Booking.resources')),
                ('user', models.ForeignKey(help_text='User that the event calender is for', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
