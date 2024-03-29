# Generated by Django 5.0.2 on 2024-03-18 23:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0006_alter_flair_roles_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='AppLink',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('feedback_form_link', models.URLField(blank=True, help_text='The link to the feedback form', null=True)),
                ('google_drive_link', models.URLField(blank=True, help_text='The link to the google drive', null=True)),
                ('google_calendar_link', models.URLField(blank=True, help_text='The link to the google calendar', null=True)),
            ],
        ),
    ]