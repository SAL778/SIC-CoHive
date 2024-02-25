from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models
from allauth.socialaccount.models import SocialAccount

class Complete_Portfolio(models.Model):
    id = models.AutoField(primary_key=True,help_text="Unique identifier for the portfolio")
    user= models.OneToOneField('CustomUser', on_delete=models.CASCADE, blank=True, null=True,help_text="The user to whom the portfolio belongs")
    description = models.TextField(help_text="Description of the portfolio")


    def __str__(self):
        return str(self.id)


    
class PortfolioItem(models.Model):

    id = models.AutoField(primary_key=True,help_text="Unique identifier for the portfolio item")
    icon = models.URLField(max_length=100, blank=True, null=True,help_text="URL to the icon image")
    title = models.CharField(max_length=100,help_text="Title of the portfolio item")
    description = models.TextField(help_text="Description of the portfolio item")
    link= models.URLField(max_length=100, blank=True, null=True,help_text="URL to the portfolio item")
    portfolio = models.ForeignKey(Complete_Portfolio, on_delete=models.CASCADE, blank=True, null=True,related_name="items", help_text="The portfolio to which the item belongs")
    

    def __str__(self):
        return self.title
  
     
      
class CustomUser(AbstractUser):
    # name = models.CharField(max_length=100)
    # uid = models.CharField(max_length=100, unique=True)
    # # You can add other fields as needed
    ROLES_CHOICES = [
        ('User', 'User'),
        ('Organization', 'Organization'),
        ('Admin', 'Admin'),
    ]

    roles = models.CharField(max_length=100, choices=ROLES_CHOICES, default='User')
    profileImage = models.URLField(max_length=100, blank=True, null=True,help_text="URL to the profile image")
    portfolioVisibility = models.BooleanField(default=True,help_text="decides if the portfolio is visible to others")
    portfolio = models.OneToOneField(Complete_Portfolio, on_delete=models.CASCADE, blank=True, null=True,help_text="The portfolio of the user")

    def save(self, *args, **kwargs):
        # Call the "real" save() method.
        super().save(*args, **kwargs)

        # Retrieve the social account object for the user.
        socialaccount_obj = SocialAccount.objects.filter(provider='google', user_id=self.id)
        picture = None
        if len(socialaccount_obj):
            picture = socialaccount_obj[0].extra_data['picture']

        # Update the profile image field.
        self.profileImage = picture
        super().save(update_fields=['profileImage'])

        if not self.portfolio:
            # Create a new portfolio and assign it to the user.
            portfolio = Complete_Portfolio.objects.create(user=self)
            self.portfolio = portfolio
            super().save(update_fields=['portfolio'])

    def __str__(self):
        return self.username


class Education(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='education',help_text="The user to whom the education belongs")
    field_of_study = models.CharField(max_length=100, blank =True ,default="nothing",help_text="The field of study of the user")
    major = models.CharField(max_length=100, blank=True, null=True,help_text="The major of the user")
    minor = models.CharField(max_length=100, blank=True, null=True,help_text="The minor of the user")

    def __str__(self):
        return self.user.username

