from django.contrib import admin
from django.urls import path, include, re_path
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from User.views import custom_login_redirect, verify_google_jwt

schema_view = get_schema_view(
    openapi.Info(
        title="SIC API",
        default_version='v1',
        description="This is a comprehensive API for the SIC project, designed to handle interaction between the front-end and back-end services. It includes endpoints for user profile, portfolio creation and management, and role assignment.",
        terms_of_service="https://www.example.com/policies/terms/",
        contact=openapi.Contact(email="contact@example.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
)


urlpatterns = [
    # Oauth
    path("auth/", include("drf_social_oauth2.urls", namespace="drf")),
    path('api/verify_google_jwt/', verify_google_jwt, name='verify_google_jwt'),
    # Project URLs 
    path("admin/", admin.site.urls),
    path("users/", include("User.urls")),
    path("bookings/", include("Booking.urls")),
    # path('accounts/', include('allauth.urls')),
    path('accounts/profile/', custom_login_redirect, name='custom-login-redirect'),
    re_path(r'^docs/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
]