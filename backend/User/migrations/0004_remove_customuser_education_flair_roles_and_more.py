# Generated by Django 5.0.2 on 2024-03-16 20:02

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("User", "0003_remove_accesstype_permissions"),
    ]

    operations = [
        migrations.RemoveField(model_name="customuser", name="education",),
        migrations.CreateModel(
            name="Flair_Roles",
            fields=[
                (
                    "id",
                    models.AutoField(
                        help_text="Unique identifier for the role",
                        primary_key=True,
                        serialize=False,
                    ),
                ),
                (
                    "role",
                    models.CharField(help_text="The role of the user", max_length=100),
                ),
                (
                    "user",
                    models.ForeignKey(
                        blank=True,
                        help_text="The user to whom the role belongs",
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddField(
            model_name="customuser",
            name="Flair_Roles",
            field=models.ManyToManyField(
                blank=True,
                help_text="The roles of the user",
                related_name="flair_roles",
                to="User.flair_roles",
            ),
        ),
        migrations.DeleteModel(name="Education_Field",),
    ]