from django.urls import path
from django.views.generic import RedirectView

from . import views

urlpatterns = [
    path('', views.AllBookingsView.as_view(), name='booking'),
    path('filter', views.FilterBookingsView.as_view(), name='bookings-filter'),
  #  path('filter/', RedirectView.as_view(url='/booking/filter')),
    path('user/<int:user_id>/', views.UserBookingView.as_view(), name='booking-list'),
    path('columns/filter', views.ColumnsView.as_view(), name='column-list'),
    path('columns/<int:pk>/', views.ColumnView.as_view(), name='column-detail'),
    path('<int:pk>/', views.ViewBookingView.as_view(), name='booking-detail'),
    path('resources/filter', views.ResourceListView.as_view(), name='resource-list'),
 #   path('statistics/AverageBooking/', views.AverageBookingView.as_view(), name='booking-analytics'),
    path('statistics/misc/', views.BookingMisc.as_view(), name='booking-statistics'),
    path('statistics/usage', views.ResourceUsageHour.as_view(), name='booking-usage-hour'),
    path('statistics/peak', views.PeakBookingHours.as_view(), name='peak-booking-times'),
]

