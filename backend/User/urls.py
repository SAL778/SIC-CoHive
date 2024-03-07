from django.urls import path
from . import views

urlpatterns = [
    path("", views.user_list, name="user_list"),
    path("profile/", views.user_profile, name="user_profile"),
    path("<int:pk>/", views.user_detail, name="user_detail"),
    path("<int:user_id>/portfolio/", views.CompletePortfolioDetail.as_view(), name="complete-portfolio-detail"),
    path("<int:user_id>/portfolio/items/", views.PortfolioItemList.as_view(), name="portfolio-item-list"),
    path("portfolio/items/<int:pk>/", views.PortfolioItemDetail.as_view(), name="portfolio-item-detail"),
    path("accessTypes/", views.AccessTypeList.as_view(), name="access-type-list"),
    path('signout/', views.signout_view, name='signout')  #added by Kenji Chiang
]