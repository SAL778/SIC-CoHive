
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('User', '0013_alter_portfolioitem_portfolio'),
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="accessPermissions",
            field=models.ManyToManyField(blank=True, to="auth.permission"),
        ),
        migrations.AlterField(
            model_name="customuser",
            name="email",
            field=models.EmailField(
                help_text="The email of the user", max_length=254, unique=True
            ),
        ),
        migrations.AlterField(
            model_name="customuser",
            name="username",
            field=models.CharField(
                help_text="The username of the user", max_length=100
            ),
        ),
        migrations.CreateModel(
            name="AccessType",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=80, unique=True)),
                (
                    "permissions",
                    models.ManyToManyField(blank=True, to="auth.permission"),
                ),
            ],
            options={
                "verbose_name": "access type",
                "verbose_name_plural": "access types",
            },
        ),
        migrations.AddField(
            model_name="customuser",
            name="accessType",
            field=models.ManyToManyField(blank=True, to="User.accesstype"),
        ),
    ]
