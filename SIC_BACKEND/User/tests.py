from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import CustomUser, Education, Complete_Portfolio, PortfolioItem, AccessType
from .serializers import CustomUserSerializer, EducationSerializer


class CustomUserTestCase(APITestCase):
    """
    Test case for the CustomUser model and API endpoints.
    """

    def setUp(self):
        self.user = CustomUser.objects.create(
            username="testuser",
            first_name="Test",
            last_name="User",
            email="testuser@example.com",
            portfolioVisibility=True,
            profileImage="http://example.com/image.jpg",
        )
        self.education = Education.objects.create(
            user=self.user,
            field_of_study="Computer Science",
            major="Software Engineering",
            minor="Data Science"
        )
        self.user.education = self.education

    def test_user_get(self):
        response = self.client.get(reverse('user_list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['first_name'], 'Test')
        self.assertEqual(response.data[0]['last_name'], 'User')
        self.assertEqual(response.data[0]['email'], 'testuser@example.com')
        self.assertEqual(response.data[0]['portfolioVisibility'], True)
        self.assertEqual(response.data[0]['profileImage'], None)
        self.assertEqual(response.data[0]['education']['field_of_study'], 'Computer Science')
        self.assertEqual(response.data[0]['education']['major'], 'Software Engineering')
        self.assertEqual(response.data[0]['education']['minor'], 'Data Science')
        
    def test_user_patch(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            reverse('user_detail', kwargs={'pk': self.user.pk}),
            {
                'first_name': 'Updated',
                'last_name': 'User',
                'email': 'updateduser@example.com',
                'portfolioVisibility': False,
                'profileImage': 'http://example.com/updated_image.jpg',
                'education': {
                    'field_of_study': 'Updated Field',
                    'major': 'Updated Major',
                    'minor': 'Updated Minor'
                }
            },
            format='json'
            # print(response.data)
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Updated')
        self.assertEqual(response.data['last_name'], 'User')
        self.assertEqual(response.data['email'], 'testuser@example.com')
        self.assertEqual(response.data['portfolioVisibility'], False)
        self.assertEqual(response.data['profileImage'], None)
        self.assertEqual(response.data['education']['field_of_study'], 'Updated Field')
        self.assertEqual(response.data['education']['major'], 'Updated Major')
        self.assertEqual(response.data['education']['minor'], 'Updated Minor')
        
        
    def test_user_delete(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(reverse('user_detail', kwargs={'pk': self.user.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CustomUser.objects.count(), 0)
        self.assertEqual(Education.objects.count(), 0)
        
    

class CompletePortfolioTestCase(APITestCase):
    """
    Test case for the CompletePortfolio model and API endpoints.
    """

    def setUp(self):
        self.user = CustomUser.objects.create(
            username="testuser",
            first_name="Test",
            last_name="User",
            email="testuser@example.com",
            portfolioVisibility=True,
            profileImage="http://example.com/image.jpg",
        )
        self.education = Education.objects.create(
            user=self.user,
            field_of_study="Computer Science",
            major="Software Engineering",
            minor="Data Science"
        )
        self.user.education = self.education
        
    
    
    def test_complete_portfolio_get(self):
        response = self.client.get(reverse('complete-portfolio-detail', kwargs={'user_id': self.user.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user'], self.user.pk)
        self.assertEqual(response.data['description'], "")
        self.assertEqual(response.data['items'], [])
        
        
        
        
    def test_patch_complete_portfolio(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(
            reverse('complete-portfolio-detail', kwargs={'user_id': self.user.pk}),
            {
                'description': 'Updated Description',
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user'], self.user.pk)
        self.assertEqual(response.data['description'], "Updated Description")
        
        
class PortfolioItemTestCase(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            username="testuser",
            first_name="Test",
            last_name="User",
            email="testuser@example.com",
            portfolioVisibility=True,
            profileImage="http://example.com/image.jpg",
        )
        self.education = Education.objects.create(
            user=self.user,
            field_of_study="Computer Science",
            major="Software Engineering",
            minor="Data Science"
        )
        self.user.education = self.education
        
    def test_portfolio_item_post(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse('portfolio-item-list', kwargs={'user_id': self.user.pk}),
            {
                'icon': 'http://example.com/icon',
                'title': 'Title',
                'description': 'Description',
                'link': 'http://example.com/link'
            },
            format='json'
        )
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['icon'], "http://example.com/icon")
        self.assertEqual(response.data['title'], 'Title')
        self.assertEqual(response.data['description'], 'Description')
        self.assertEqual(response.data['link'], 'http://example.com/link')
        
        
        
    def test_complete_portfolio_get(self):
        self.test_portfolio_item_post()
        response = self.client.get(reverse('complete-portfolio-detail', kwargs={'user_id': self.user.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user'], self.user.pk)
        self.assertEqual(response.data['description'], "")
        self.assertEqual(response.data['items'][0]['icon'], "http://example.com/icon")
        self.assertEqual(response.data['items'][0]['title'], 'Title')
        self.assertEqual(response.data['items'][0]['description'], 'Description')
        self.assertEqual(response.data['items'][0]['link'], 'http://example.com/link')
        
    def test_portfolio_item_patch(self):
        self.test_portfolio_item_post()
        response = self.client.patch(
            reverse('portfolio-item-detail', kwargs={'pk': 1}),
            {
                'icon': 'http://example.com/updated_icon',
                'title': 'Updated Title',
                'description': 'Updated Description',
                'link': 'http://example.com/updated_link'
            },
            format='json'
            
        )
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['icon'], "http://example.com/updated_icon")
        self.assertEqual(response.data['title'], 'Updated Title')
        self.assertEqual(response.data['description'], 'Updated Description')
        self.assertEqual(response.data['link'], 'http://example.com/updated_link')
       
       
       
       
    def test_portfolio_item_delete(self):
        self.test_portfolio_item_post()
        self.assertEqual(PortfolioItem.objects.count(), 1)
        response = self.client.delete(reverse('portfolio-item-detail', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PortfolioItem.objects.count(), 0)
        response = self.client.get(reverse('complete-portfolio-detail', kwargs={'user_id': self.user.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['items'], [])
   
    
    
    
    
    
    
    
    
    
    
    
    
    
