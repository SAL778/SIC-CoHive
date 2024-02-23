from django.urls import path,re_path

from . import views # . referes to the current module we are in

urlpatterns = [
    path("", views.index, name="index"),
    path("users/", views.UserList.as_view(), name="user-list"),
    path("users/<int:pk>", views.UserDetail.as_view(), name="user-detail"),
    path("users/<int:pk>/create_portfolio", views.CompletePortfolioDetail.as_view(), name="complete-portfolio-detail"),
]