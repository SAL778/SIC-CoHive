from django.contrib import admin
from django.urls import path, include, re_path
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from User.views import verify_token_expiry, verify_google_jwt, AppLinkList

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
    path('api/verify_google_jwt/', verify_google_jwt, name='verify_google_jwt'),
    path('api/verify_token_expiry/', verify_token_expiry, name='verify_token_expiry'),
    # Project URLs 
    path("api/admin/", admin.site.urls),
    path("api/users/", include("User.urls")),
    path("api/bookings/", include("Booking.urls")),
    # path('accounts/', include('allauth.urls')),
    re_path(r'^api/docs/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path("api/applinks/", AppLinkList.as_view(), name="app-link-list"),

    #gdrive
    path('api/google_drive_integration/', include('Google_drive_integration.urls'))
]
