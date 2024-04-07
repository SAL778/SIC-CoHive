from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models
# from allauth.socialaccount.models import SocialAccount
from django.contrib.auth.models import Permission

class Flair_Roles(models.Model):
    id = models.AutoField(primary_key=True,help_text="Unique identifier for the role")
    role_name = models.CharField(max_length=100,null=True,help_text="The name of the role")

    def __str__(self):
        return self.role_name


class Complete_Portfolio(models.Model):
    id = models.AutoField(primary_key=True,help_text="Unique identifier for the portfolio")
    user= models.OneToOneField('CustomUser', on_delete=models.CASCADE, blank=True, null=True, help_text="The user to whom the portfolio belongs")
    description = models.TextField(help_text="Description of the portfolio")

    def __str__(self):
        return str(self.id)

class PortfolioItem(models.Model):

    id = models.AutoField(primary_key=True,help_text="Unique identifier for the portfolio item")
    icon = models.CharField(max_length=100, blank=True, null=True,help_text="Icon of the portfolio item")
    title = models.CharField(max_length=100,help_text="Title of the portfolio item")
    description = models.TextField(help_text="Description of the portfolio item")
    link= models.URLField(max_length=100, blank=True, null=True,help_text="URL to the portfolio item")
    portfolio = models.ForeignKey(Complete_Portfolio, on_delete=models.CASCADE, blank=True, null=True,related_name="items", help_text="The portfolio to which the item belongs")
    
    def __str__(self):
        return self.title
  
class AccessType(models.Model):
    name = models.CharField(max_length=80, unique=True,help_text="The name of the access type")
    
    class Meta:
        verbose_name = 'access type'
        verbose_name_plural = 'access types'

    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    # name = models.CharField(max_length=100)
    # uid = models.CharField(max_length=100, unique=True)
    # # You can add other fields as needed
    username = models.CharField(max_length=100,unique=False,help_text="The username of the user")
    email = models.EmailField(unique=True,help_text="The email of the user")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    # ROLES_CHOICES = [
    #     ('User', 'User'),
    #     ('Organization', 'Organization'),
    #     ('Admin', 'Admin'),
    # ]
    #
    # roles = models.CharField(max_length=100, choices=ROLES_CHOICES, default='User',help_text="The role of the user")
    profileImage = models.URLField(max_length=100, blank=True, null=True,help_text="URL to the profile image")
    portfolioVisibility = models.BooleanField(default=True,help_text="decides if the portfolio is visible to others")
    portfolio = models.OneToOneField(Complete_Portfolio, on_delete=models.CASCADE, blank=True, null=True,help_text="The portfolio of the user")
    accessType = models.ManyToManyField(AccessType, blank=True,related_name="accessType",help_text="The access type of the user")
    accessPermissions = models.ManyToManyField(Permission, blank=True)
    flair_roles = models.ManyToManyField(Flair_Roles, blank=True, related_name="users")
    education = models.TextField(blank=True, null=True,help_text="The education of the user")
    def save(self, *args, **kwargs):
        # Call the "real" save() method.
        super().save(*args, **kwargs)


        if not self.portfolio:
            # Create a new portfolio and assign it to the user.
            portfolio = Complete_Portfolio.objects.create(user=self)
            self.portfolio = portfolio
            super().save(update_fields=['portfolio'])

    def __str__(self):
        return self.username

# AppLinks model allows the admin to add links to the app from the admin panel and maintain them
# Stores the feedback form link, the google drive link, and the google calendar link
class AppLink(models.Model):
    feedback_form_link = models.URLField(max_length=200, blank=True, null=True, help_text="The link to the Contact Us / Feedback form")
    event_submission_form_link = models.URLField(max_length=200, blank=True, null=True, help_text="The link to the Event Submission form")
    google_calendar_link = models.URLField(max_length=200, blank=True, null=True, help_text="The link to the embedded SIC Google Calendar")

    def __str__(self):
        return "App Link"