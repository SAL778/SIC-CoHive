# Generated by Django 5.0.2 on 2024-02-10 22:27

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("User", "0002_remove_customuser_name_remove_customuser_uid_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="role",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name="portfolio",
            name="visibility",
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name="portfolio",
            name="user",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
                verbose_name="user",
            ),
        ),
    ]
