from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    # name = models.CharField(max_length=100)
    # uid = models.CharField(max_length=100, unique=True)
    # # You can add other fields as needed
    role = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return self.username
    
    @property
    def display_role(self):
        # Only return the role for staff members
        return self.role if self.is_staff or self.is_superuser else None  
    
    
class Portfolio(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,verbose_name="user")
    name = models.CharField(max_length=100) ## like python portfolio, or web development portfolio if a user has 2 or more portfolios
    description = models.TextField()
    major = models.CharField(max_length=100)
    portfolio_link = models.URLField(blank=True, null=True) # Optional link to portfolio
    document = models.FileField(upload_to='portfolio_documents/', blank=True, null=True)  # Optional document
    visibility = models.BooleanField(default=True) # True if the portfolio is visible to everyone, False if it is private
    
    def __str__(self):
        return self.user.username
