from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import CustomUser, Education_Field, Complete_Portfolio, PortfolioItem, AccessType
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
        self.education = Education_Field.objects.create(
            user=self.user,
            field_of_study="Computer Science",
            major="Software Engineering",
            minor="Data Science"
        )
        self.user.education = self.education

    '''
    US 1.03 As an admin, I want to include additional information in my profile like innovation center role, so it can be visible on my profile.
    US 1.05 As a user, I want to look up other users by using the search bar, so that I can find information about my friends, organizations, and admins.
    '''
    def test_user_get(self):
        '''
        Test the API endpoint for retrieving a list of all users.
        '''
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
        self.assertEqual(response.data[0]['roles'], 'User')

    '''
    US 1.01 As an admin, I want to be able to assign roles to users, so that I can control their access to features.
    US 1.02 As a user, I want to create and manage my profile, including my basic information and academic details.   
    US 1.06 As a user, I want to be able to change the visibility of my portfolio, so that I can control if everyone/organizations/only me can see it.
    '''
    def test_user_patch(self):
        '''
        Test the API endpoint for updating a user's profile.
        '''
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
        self.assertEqual(response.data['email'], 'testuser@example.com') # Email should not be updated
        self.assertEqual(response.data['portfolioVisibility'], False)
        self.assertEqual(response.data['profileImage'], None)
        self.assertEqual(response.data['education']['field_of_study'], 'Updated Field')
        self.assertEqual(response.data['education']['major'], 'Updated Major')
        self.assertEqual(response.data['education']['minor'], 'Updated Minor')

    def test_user_patch_failure(self):
        '''
        Test the API endpoint for updating a user's profile with invalid data.
        '''
        # Invalid portfolioVisibility
        response = self.client.patch(
            reverse('user_detail', kwargs={'pk': self.user.pk}),
            {'portfolioVisibility': "OK"},  # Invalid data: portfolioVisibility should be a boolean
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Invalid profileImage
        response = self.client.patch(
            reverse('user_detail', kwargs={'pk': self.user.pk}),
            {'profileImage': 'invalidurl'},  # Invalid data: profileImage should be a valid URL
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Trying to update a user that does not exist
        response = self.client.patch(
            reverse('user_detail', kwargs={'pk': 999999}),  # Assuming 9999 is an ID that does not exist
            {'profileImage': 'invalidurl'},  # Invalid data: profileImage should be a valid URL
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_delete(self):
        '''
        Test the API endpoint for deleting a user.
        '''
        self.client.force_authenticate(user=self.user)
        response = self.client.delete(reverse('user_detail', kwargs={'pk': self.user.pk}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(CustomUser.objects.count(), 0)
        self.assertEqual(Education_Field.objects.count(), 0)

    

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
        self.education = Education_Field.objects.create(
            user=self.user,
            field_of_study="Computer Science",
            major="Software Engineering",
            minor="Data Science"
        )
        self.user.education = self.education
        
    

    def test_complete_portfolio_get(self):
        '''
        Test the API endpoint for retrieving a user's complete portfolio.
        '''
        response = self.client.get(reverse('complete-portfolio-detail', kwargs={'user_id': self.user.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user'], self.user.pk)
        self.assertEqual(response.data['description'], "")
        self.assertEqual(response.data['items'], [])
        
    def test_complete_portfolio_get_failure(self):
        '''
        Test the API endpoint for retrieving a user's complete portfolio with invalid data.
        '''
        # Trying to get a user that does not exist
        response = self.client.get(reverse('complete-portfolio-detail', kwargs={'user_id': 999999}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        
    def test_complete_portfolio_patch(self):
        '''
        Test the API endpoint for updating a user's complete portfolio.
        '''
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

    def test_complete_portfolio_patch_add_user_failure(self):
        '''
        Test the API endpoint for updating a user's complete portfolio with invalid data.
        '''
        # Trying to add a user that does not exist
        response = self.client.patch(reverse('complete-portfolio-detail', kwargs={'user_id': 999999}),  # Assuming 9999 is an ID that does not exist
             {
                 'description': 'Updated Description',
             },
             format='json'
             )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
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
        self.education = Education_Field.objects.create(
            user=self.user,
            field_of_study="Computer Science",
            major="Software Engineering",
            minor="Data Science"
        )
        self.user.education = self.education

    '''
    US 1.04 As a user, I want to upload text and link to a portfolio in my profile, so that prospective employers will see my capabilities.
    '''
    def test_portfolio_item_post(self):
        '''
        Test the API endpoint for creating a new portfolio item.
        '''
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
        '''
        Test the API endpoint for retrieving a user's complete portfolio.
        '''
        self.test_portfolio_item_post()
        response = self.client.get(reverse('complete-portfolio-detail', kwargs={'user_id': self.user.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user'], self.user.pk)
        self.assertEqual(response.data['description'], "")
        self.assertEqual(response.data['items'][0]['icon'], "http://example.com/icon")
        self.assertEqual(response.data['items'][0]['title'], 'Title')
        self.assertEqual(response.data['items'][0]['description'], 'Description')
        self.assertEqual(response.data['items'][0]['link'], 'http://example.com/link')

    def test_portfolio_get_failure(self):
        '''
        Test the API endpoint for retrieving a user's complete portfolio with invalid data.
        '''
        # Trying to get a user that does not exist
        response = self.client.get(reverse('complete-portfolio-detail', kwargs={'user_id': 999999}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_portfolio_item_patch(self):
        '''
        Test the API endpoint for updating a portfolio item.
        '''
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
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['icon'], "http://example.com/updated_icon")
        self.assertEqual(response.data['title'], 'Updated Title')
        self.assertEqual(response.data['description'], 'Updated Description')
        self.assertEqual(response.data['link'], 'http://example.com/updated_link')
       
    def test_portfolio_item_patch_failure(self):
        '''
        Test the API endpoint for updating a portfolio item with invalid data.
        '''
        # Trying to update a user that does not exist
        response = self.client.patch(
            reverse('portfolio-item-detail', kwargs={'pk': 999999}),  # Assuming 9999 is an ID that does not exist
            {
                'icon': 'http://example.com/updated_icon',
                'title': 'Updated Title',
                'description': 'Updated Description',
                'link': 'http://example.com/updated_link'
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Invalid icon
        response = self.client.patch(
            reverse('portfolio-item-detail', kwargs={'pk': 1}),
            {'icon': 'invalidurl'},  # Invalid data: icon should be a valid URL
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # Invalid link
        response = self.client.patch(
            reverse('portfolio-item-detail', kwargs={'pk': 1}),
            {'link': 'invalidurl'},  # Invalid data: link should be a valid URL
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
       
    def test_portfolio_item_delete(self):
        '''
        Test the API endpoint for deleting a portfolio item.
        '''
        self.test_portfolio_item_post()
        self.assertEqual(PortfolioItem.objects.count(), 1)
        response = self.client.delete(reverse('portfolio-item-detail', kwargs={'pk': 1}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(PortfolioItem.objects.count(), 0)
        response = self.client.get(reverse('complete-portfolio-detail', kwargs={'user_id': self.user.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['items'], [])
   
    
class AccessTypeTestCase(APITestCase):
    def test_access_type_get(self):
        '''
        Test the API endpoint for retrieving a list of all access types.
        '''
        self.accessType = AccessType.objects.create(
            name="Some Access Type"
        )
        self.accessType = AccessType.objects.create(
            name="Another Access Type"
        )
        response = self.client.get(reverse('access-type-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['name'], 'Some Access Type')
        self.assertEqual(response.data[1]['name'], 'Another Access Type')


    
    
    
    
    
    
    
    
    
    
