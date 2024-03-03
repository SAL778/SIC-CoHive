from django.urls import path
from . import views

urlpatterns = [
    path('', views.allBookingsView.as_view(), name='booking'),
    path('create-booking/<int:user_id>/', views.CreateBookingView.as_view(), name='create-booking'),
    path('add-resources/', views.AddResourcesView.as_view(), name='add-resources'),
    path('<int:pk>/', views.ViewBookingView.as_view(), name='booking-detail'),
    

]