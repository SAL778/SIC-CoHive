from django.shortcuts import get_object_or_404, HttpResponse
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from .models import CustomUser, Complete_Portfolio, PortfolioItem, AccessType, AppLink
from .serializers import CustomUserSerializer, PortfolioItemSerializer, CompletePortfolioSerializer, AccessTypeSerializer, AppLinkSerializer
from django.db.models import Q
from rest_framework import generics,status
from django.http import HttpResponseBadRequest, HttpResponseRedirect, JsonResponse
from django.http import HttpResponse
from rest_framework.authtoken.models import Token
from rest_framework.views import APIView
from django.contrib.auth import logout
from google.auth.transport import requests
from google.oauth2 import id_token
from dotenv import load_dotenv
import os
from django.core.paginator import Paginator
from django.http import Http404
load_dotenv()

@api_view(['POST'])
def verify_google_jwt(request):
    '''
    This function verifies the JWT token provided by Google and creates a new user if it doesn't exist.
    '''
    client_id = os.getenv('SOCIAL_AUTH_GOOGLE_OAUTH2_KEY')
    
    # Get the JWT token from the request (e.g., from the Authorization header)
    jwt_token = request.data.get('jwt_token')

    if not jwt_token:
        return JsonResponse({'error': 'No JWT token provided'}, status=400)

    try:
        # Verify the JWT token using Google's public keys
        id_info = id_token.verify_oauth2_token(jwt_token, requests.Request(), client_id)

        # Check if the user already exists
        user = CustomUser.objects.filter(email=id_info['email']).first()

        if not user:
            # Create a new user if it doesn't exist
            user = CustomUser.objects.create(
                username=id_info['email'],
                email=id_info['email'],
                profileImage=id_info['picture'],
                first_name=id_info['given_name'],
                last_name=id_info['family_name'],
            )

        token, created = Token.objects.get_or_create(user=user)

        # Reset the token if it already exists to hand out a new one
        if not created:
            token.delete()
            token = Token.objects.create(user=user)

        access_token = str(token.key)
        print("access_token",access_token)
        response = HttpResponse('Authentication successful')
        # Set the access token as a cookie with a max age of 86400 seconds which is 24 hours
        response.set_cookie('access_token', access_token, max_age=86400)
        response.status_code = 200
        return response

    except ValueError as e:
        return JsonResponse({'error': f'JWT verification failed: {str(e)}'}, status=401)

@swagger_auto_schema(method='get', operation_description="Verify the expiry of the access token.", responses={200: 'Token is valid', 401: 'Invalid token'})
@api_view(['GET'])    
def verify_token_expiry(request):
    user = get_user_from_token(request)
    if user:
        return Response({'message': 'Token is valid'})
    else:
        return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

def get_user_from_token(request):
    try:
        access_token = request.META['HTTP_AUTHORIZATION'].split(' ')[1]
        token_obj = Token.objects.get(key=access_token)
        user = token_obj.user
        return user
    except Exception as e:
        raise Http404('Failed to get user from token: ' + str(e))

@swagger_auto_schema(method='post', operation_description="Sign out the authenticated user.", responses={200: 'Logged out'})
@api_view(['POST'])
def signout_view(request):
    try:
        # Delete the token from the database when the user logs out if its provided and valid
        access_token = request.META['HTTP_AUTHORIZATION'].split(' ')[1]
        token_obj = Token.objects.get(key=access_token)
        print(token_obj)
        token_obj.delete()
    except:
        # If the token is not provided or is invalid, we'll just sign the user out in the same way
        pass

    response = HttpResponse("Logged out")

    response.delete_cookie('access_token') # Instructs the browser to delete the access_token cookie
    response.delete_cookie('messages')
    response.delete_cookie('sessionid')  # Instructs the browser to delete the sessionid cookie
    response.delete_cookie('csrftoken') # Instructs the browser to delete the csrftoken cookie

    return response

@swagger_auto_schema(method='get', operation_description="Get the profile of the authenticated user.", responses={200: CustomUserSerializer})
@api_view(['GET'])
def user_profile(request):
    """
    API endpoint for retrieving the profile of the authenticated user.

    Parameters:
    - request: The HTTP request object.

    Returns:
    - A Response object with serialized data of the authenticated user if the access token is valid, otherwise a Response object with an error message.
    """

    user = get_user_from_token(request)
    if isinstance(user, Response):
        return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)
    
    # Serialize the user data using your CustomUserSerializer
    
    serializer = CustomUserSerializer(user)
    return Response(serializer.data)


@api_view(['GET'])
def index(request):
    return HttpResponse("Hello, world. You're at the User index. You're not supposed to be here.")

# USER
@swagger_auto_schema(method='get', operation_description="Get a list of all users.", responses={200: CustomUserSerializer(many=True)})
@swagger_auto_schema(method='post', operation_description="Create a new user.", request_body=CustomUserSerializer, responses={201: CustomUserSerializer, 400: 'Invalid data'})
@api_view(['GET' ,'POST'])
def user_list(request):
    """
    API endpoint for listing and creating users.

    GET: Returns a list of all users.
    POST: Creates a new user.

    Parameters:
    - request: The HTTP request object.

    Returns:
    - If GET request: A Response object with serialized data of all users.
    - If POST request: A Response object with serialized data of the created user if valid, otherwise a Response object with errors.
    """

    if request.method == 'GET':
        search = request.GET.get('search', '')
        filters = request.GET.get('filter', '')

        page_num = request.GET.get('page', '1')

        queryset = CustomUser.objects.all()

        if search:
            queryset = queryset.filter(Q(first_name__icontains=search) | Q(last_name__icontains=search))
        
        if filters:
            access_types = filters.split(',')
            queryset = queryset.filter(accessType__name__in=access_types).distinct()
        
        queryset = queryset.order_by('first_name', 'last_name')

        # Paginate the queryset, can be changed to any number of users per page
        users_per_page = 20
        paginator = Paginator(queryset, per_page=users_per_page)

        # Calculate total number of pages for frontend
        total_pages = paginator.num_pages

        # Check if page number is valid, in case the Next/Previous button is clicked
        page_num = int(page_num)

        if page_num > total_pages:
            page_num = total_pages
        elif page_num < 1:
            page_num = 1

        page_object = paginator.get_page(page_num)
        serializer = CustomUserSerializer(page_object, many=True)

        # Return the serialized data and total number of pages
        response_data = {
            'users': serializer.data,
            'total_pages': total_pages
        }

        return Response(response_data)



# ONE USER
@swagger_auto_schema(method='get', operation_description="Get a user by ID.", responses={200: CustomUserSerializer})
@swagger_auto_schema(method='patch', operation_description="Update a user by ID.", request_body=CustomUserSerializer, responses={200: CustomUserSerializer, 400: 'Invalid data'})
@swagger_auto_schema(method='delete', operation_description="Delete a user by ID.", responses={204: 'No Content'})
@api_view(['GET','PATCH','DELETE'])
def user_detail(request, pk):
    """
    Retrieve, update or delete a user.

    Parameters:
    - request: The HTTP request object.

    Returns:
    - If the request method is GET, returns the serialized user data.
    - If the request method is PUT, updates and returns the serialized user data if valid, otherwise returns the serializer errors.
    - If the request method is PATCH, updates and returns the serialized user data.
    - If the request method is DELETE, deletes the user and returns a 204 No Content response.
    """
    
    # try:
    #     access_token = request.META['HTTP_AUTHORIZATION']
    #     print("access_token")
    #     print(access_token)
    #     token_obj = Token.objects.get(key=access_token)
    #     user = token_obj.user
        
        # user = get_object_or_404(CustomUser, pk=pk)

    # user = get_user_from_token(request)
    user = get_object_or_404(CustomUser, pk=pk)
   # print("user",user)
    if request.method == 'GET':
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)
    elif request.method == 'PATCH':
        serializer = CustomUserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        serializer = CustomUserSerializer(user)
        serializer.delete(user)
        return Response(status=204)
    # except Exception as e:
    #     return Response({'error': str(e)}, status=status.HTTP_401_UNAUTHORIZED)
    

class CompletePortfolioDetail(generics.RetrieveUpdateAPIView):
    """
    get:
    API view to retrieve the portfolio of a user.
    put:
    API view to update the portfolio of a user.
    patch:
    API view to partially update the portfolio of a user.
    """

    serializer_class = CompletePortfolioSerializer
   
    
    def get_queryset(self):
        return Complete_Portfolio.objects.all()

    def get_object(self):
        user_id = self.kwargs['user_id']
        self.user = get_object_or_404(CustomUser, pk=user_id)
        portfolio, created = Complete_Portfolio.objects.get_or_create(user=self.user)
        return portfolio

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        user_id = self.kwargs['user_id']
        self.user = get_object_or_404(CustomUser, pk=user_id)
        user1=get_user_from_token(request)
        if self.user != user1:
            return Response({'error': 'You do not have permission to edit this portfolio.'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            instance=self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)  # set partial=True to update a data partially
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        
    def put(self, request, *args, **kwargs):
        user_id = self.kwargs['user_id']
        self.user = get_object_or_404(CustomUser, pk=user_id)
        user1=get_user_from_token(request)
        if self.user != user1:
            return Response({'error': 'You do not have permission to edit this portfolio.'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            instance=self.get_object()
            serializer = self.get_serializer(instance, data=request.data)
            

class PortfolioItemList(generics.ListCreateAPIView):
    '''
    get:
    API view to retrieve the list of all portfolio items.
    post:
    API view to create a new portfolio item.
    '''
    serializer_class = PortfolioItemSerializer

    def get_object(self):
        user_id = self.kwargs['user_id']
        return get_object_or_404(Complete_Portfolio, user_id=user_id)

    def get_queryset(self):
        portfolio = self.get_object()
        return PortfolioItem.objects.filter(portfolio=portfolio)

    def post(self, request, *args, **kwargs):
        user_id = self.kwargs['user_id']
        user = get_object_or_404(CustomUser, pk=user_id)
        user1=get_user_from_token(request)
        if user != user1:
            return Response({'error': 'You do not have permission to create a portfolio item.'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            portfolio = self.get_object()
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                serializer.save(portfolio=portfolio)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PortfolioItemDetail(APIView):
    @swagger_auto_schema(operation_description="Get a portfolio item by ID.", responses={200: PortfolioItemSerializer})
    def get(self, request, pk):
        obj = get_object_or_404(PortfolioItem, pk=pk)
        serializer = PortfolioItemSerializer(obj)
        return Response(serializer.data)

    @swagger_auto_schema(operation_description="Update a portfolio item by ID.", request_body=PortfolioItemSerializer, responses={200: PortfolioItemSerializer, 400: 'Invalid data'})
    def put(self, request, pk):
        obj = get_object_or_404(PortfolioItem, pk=pk)
        user = get_user_from_token(request)

        if isinstance(user, Response):
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

        if obj.portfolio.user != user:
            return Response({'error': 'You do not have permission to update this portfolio item.'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = PortfolioItemSerializer(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Partially update a portfolio item by ID.", request_body=PortfolioItemSerializer, responses={200: PortfolioItemSerializer, 400: 'Invalid data'})
    def patch(self, request, pk):
        obj = get_object_or_404(PortfolioItem, pk=pk)
        user = get_user_from_token(request)

        if isinstance(user, Response):
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

        if obj.portfolio.user != user:
            return Response({'error': 'You do not have permission to partially update this portfolio item.'}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = PortfolioItemSerializer(obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(operation_description="Delete a portfolio item by ID.", responses={204: 'No Content'})
    def delete(self, request, pk):
        obj = get_object_or_404(PortfolioItem, pk=pk)
        user = get_user_from_token(request)

        if isinstance(user, Response):
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

        if obj.portfolio.user != user:
            return Response({'error': 'You do not have permission to delete this portfolio item.'}, status=status.HTTP_401_UNAUTHORIZED)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AccessTypeList(generics.ListAPIView):
    '''
    get:
    API view to retrieve the list of all access types.
    '''
    queryset = AccessType.objects.all()
    serializer_class = AccessTypeSerializer
    
    
class FlairList(generics.CreateAPIView):
    '''
    post:
    API view to create a new flair.
    '''
    serializer_class = AccessTypeSerializer
    queryset = AccessType.objects.all()

    def post(self, request, *args, **kwargs):
        user = get_user_from_token(request)

        if isinstance(user, Response):
            return Response({'error': 'Invalid token'}, status=status.HTTP_401_UNAUTHORIZED)

        if user.is_staff:
            return super().post(request, *args, **kwargs)
        else:
            return Response({'error': 'You do not have permission to create a flair.'}, status=status.HTTP_401_UNAUTHORIZED)


class AppLinkList(generics.ListAPIView):
    '''
    get:
    API view to retrieve the list of all app links.
    '''
    serializer_class = AppLinkSerializer
    queryset = AppLink.objects.all()
