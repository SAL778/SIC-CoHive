from django.contrib import admin
from .models import CustomUser , Portfolio
from django.contrib.auth.admin import UserAdmin

# Register your models here.
# admin.site.register(CustomUser, UserAdmin)
admin.site.register(Portfolio)

# admin.site.register(CustomUser)

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
        ('Basic Information', {'fields': ('role',)}),
    )
