from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("users/", views.user_list, name="user_list"),
    path("users/<int:pk>/", views.user_detail, name="user_detail"),
    path("users/<int:user_id>/portfolio", views.CompletePortfolioDetail.as_view(), name="complete-portfolio-detail"),
    path("users/portfolios/<int:portfolio_id>/items", views.PortfolioItemList.as_view(), name="portfolio-item-list"),
    path("users/portfolios/items/<int:pk>", views.PortfolioItemDetail.as_view(), name="portfolio-item-detail"),    
]