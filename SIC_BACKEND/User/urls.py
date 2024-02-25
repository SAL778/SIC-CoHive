from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("users/", views.user_list, name="user_list"),
    path("users/<int:pk>/", views.user_detail, name="user_detail"),
    path("users/<int:user_id>/create_portfolio/<int:pk>/", views.complete_portfolio_detail, name="complete_portfolio_detail"),
]