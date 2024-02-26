from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models
from allauth.socialaccount.models import SocialAccount
from django.contrib.auth.models import Permission

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
  
class AccessType(models.Model):
    name = models.CharField(max_length=80, unique=True,help_text="The name of the access type")
    permissions = models.ManyToManyField(Permission, blank=True,help_text="The permissions of the access type")

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

    ROLES_CHOICES = [
        ('User', 'User'),
        ('Organization', 'Organization'),
        ('Admin', 'Admin'),
    ]

    roles = models.CharField(max_length=100, choices=ROLES_CHOICES, default='User',help_text="The role of the user")
    profileImage = models.URLField(max_length=100, blank=True, null=True,help_text="URL to the profile image")
    portfolioVisibility = models.BooleanField(default=True,help_text="decides if the portfolio is visible to others")
    portfolio = models.OneToOneField(Complete_Portfolio, on_delete=models.CASCADE, blank=True, null=True,help_text="The portfolio of the user")

    accessType = models.ManyToManyField(AccessType, blank=True,related_name="accessType",help_text="The access type of the user")
    accessPermissions = models.ManyToManyField(Permission, blank=True)

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




# {
#     "id": 1,
#     "first_name": "",
#     "last_name": "",
#     "email": "kannan@gmail.com",
#     "is_staff": true,
#     "portfolioVisibility": true,
#     "profileImage": null,
#     "portfolio": 1,
#     "education": {
#         "field_of_study": "Computer Science2",
#         "major": "Software Engineering2",
#         "minor": "Data Science2"
#     },
#     "accessType": [
#         {
#             "name": "complete access granted"
#         }
#     ]
# }