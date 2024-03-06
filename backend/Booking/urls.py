from django.urls import path
from django.views.generic import RedirectView

from . import views

urlpatterns = [
    path('', views.AllBookingsView.as_view(), name='booking'),
    path('filter', views.FilterBookingsView.as_view(), name='bookings-filter'),
  #  path('filter/', RedirectView.as_view(url='/booking/filter')),
    path('user/<int:user_id>/', views.UserBookingView.as_view(), name='booking-list'),
    path('resources/', views.ResourcesView.as_view(), name='resources-list'),
    path('<int:pk>/', views.ViewBookingView.as_view(), name='booking-detail'),
]