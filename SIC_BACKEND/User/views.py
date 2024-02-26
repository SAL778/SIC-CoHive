from django.shortcuts import get_object_or_404, render
from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from .models import CustomUser, Complete_Portfolio, PortfolioItem
from .serializers import CustomUserSerializer, PortfolioItemSerializer, CompletePortfolioSerializer
from django.db.models import Q
from rest_framework import generics,status
from rest_framework.views import APIView

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
        if search:
            queryset = CustomUser.objects.filter(Q(first_name__icontains=search) | Q(last_name__icontains=search))
        else:
            queryset = CustomUser.objects.all()
        
        serializer = CustomUserSerializer(queryset, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = CustomUserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)


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
    - pk: The primary key of the user.

    Returns:
    - If the request method is GET, returns the serialized user data.
    - If the request method is PUT, updates and returns the serialized user data if valid, otherwise returns the serializer errors.
    - If the request method is PATCH, updates and returns the serialized user data.
    - If the request method is DELETE, deletes the user and returns a 204 No Content response.
    """
    user = get_object_or_404(CustomUser, pk=pk)

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
        user.delete()
        return Response(status=204)
    



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
        # Get the user with the provided ID
        user_id = self.kwargs['user_id']
        user = get_object_or_404(CustomUser, pk=user_id)
        # Check if the portfolio exists for this user
        portfolio, created = Complete_Portfolio.objects.get_or_create(user=user)
        return portfolio

    def get(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)  # set partial=True to update a data partially
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class PortfolioItemList(generics.ListCreateAPIView):
    '''
    get:
    API view to retrieve the list of all portfolio items.
    post:
    API view to create a new portfolio item.
    '''
    serializer_class = PortfolioItemSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        portfolio = get_object_or_404(Complete_Portfolio, user_id=user_id)
        return PortfolioItem.objects.filter(portfolio=portfolio)

    def perform_create(self, serializer):
        user_id = self.kwargs['user_id']
        portfolio = get_object_or_404(Complete_Portfolio, user_id=user_id)
        serializer.save(portfolio=portfolio)


class PortfolioItemDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = PortfolioItem.objects.all()
    serializer_class = PortfolioItemSerializer

    def get_object(self):
        return get_object_or_404(PortfolioItem, pk=self.kwargs['pk'])
