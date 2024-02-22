from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class PortfolioItem(models.Model):

    id = models.AutoField(primary_key=True)
    icon = models.URLField(max_length=100, blank=True, null=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    link = models.URLField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.title


class Portfolio(models.Model):
    id = models.AutoField(primary_key=True)
    description = models.TextField()
    portfolioItem = models.ForeignKey(PortfolioItem, on_delete=models.CASCADE, blank=True, null=True)
    def __str__(self):
        return str(self.id)


class CustomUser(AbstractUser):
    # name = models.CharField(max_length=100)
    # uid = models.CharField(max_length=100, unique=True)
    # # You can add other fields as needed
    role = models.CharField(max_length=100, blank=True, null=True)
    profileImage = models.URLField(max_length=100, blank=True, null=True)
    portfolioVisibility = models.BooleanField(default=True)
    portfolio = models.OneToOneField(Portfolio, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.username

    @property
    def display_role(self):
        # Only return the role for staff members
        return self.role if self.is_staff or self.is_superuser else None

    def save(self, *args, **kwargs):
        # Call the "real" save() method.
        super().save(*args, **kwargs)

        # Check if the user already has a portfolio.
        if not self.portfolio:
            # Create a new portfolio and assign it to the user.
            portfolio = Portfolio.objects.create()
            self.portfolio = portfolio
            super().save(update_fields=['portfolio'])
