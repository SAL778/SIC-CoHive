from django.shortcuts import get_object_or_404, render
from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CustomUser, Complete_Portfolio, PortfolioItem
from .serializers import CustomUserSerializer, PortfolioItemSerializer
from django.db.models import Q

@api_view(['GET'])
def index(request):
    return HttpResponse("Hello, world. You're at the User index. You're not supposed to be here.")

# USER
@api_view(['GET', 'POST'])
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
@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, pk):
    """
    Retrieve, update or delete a user.

    Parameters:
    - request: The HTTP request object.
    - pk: The primary key of the user.

    Returns:
    - If the request method is GET, returns the serialized user data.
    - If the request method is PUT, updates and returns the serialized user data if valid, otherwise returns the serializer errors.
    - If the request method is DELETE, deletes the user and returns a 204 No Content response.
    """
    user = get_object_or_404(CustomUser, pk=pk)

    if request.method == 'GET':
        serializer = CustomUserSerializer(user)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = CustomUserSerializer(user, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        user.delete()
        return Response(status=204)

# PORTFOLIO
@api_view(['GET', 'PUT', 'DELETE'])
def complete_portfolio_detail(request, user_id, pk):
    """
    Retrieve, update or delete a complete portfolio item.

    Parameters:
    - request: The HTTP request object.
    - user_id: The ID of the user.
    - pk: The ID of the portfolio item.

    Returns:
    - If the request method is GET, returns the serialized portfolio item.
    - If the request method is PUT, updates and returns the serialized portfolio item.
    - If the request method is DELETE, deletes the portfolio item and returns a 204 status code.
    """
    portfolio = get_object_or_404(Complete_Portfolio, user_id=user_id, pk=pk)

    if request.method == 'GET':
        serializer = PortfolioItemSerializer(portfolio)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PortfolioItemSerializer(portfolio, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    elif request.method == 'DELETE':
        portfolio.delete()
        return Response(status=204)
