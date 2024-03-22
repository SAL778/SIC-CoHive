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
    path('analytics/', views.BookingAnalyticsView.as_view(), name='booking-analytics'),
    path('statistics/', views.BookingStatisticsView.as_view(), name='booking-statistics'),
    path('frequencies/', views.BookingFrequenciesView.as_view(), name='booking-frequencies'),
]

