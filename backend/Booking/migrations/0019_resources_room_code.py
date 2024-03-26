# Generated by Django 4.2.9 on 2024-03-26 00:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Booking', '0018_event_eventcalender'),
    ]

    operations = [
        migrations.AddField(
            model_name='resources',
            name='room_code',
            field=models.CharField(blank=True, help_text='Room code of the asset', max_length=100, null=True),
        ),
    ]
