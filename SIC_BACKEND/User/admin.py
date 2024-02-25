from django.contrib import admin
from .models import CustomUser , Complete_Portfolio, PortfolioItem,AccessType
from django.contrib.auth.admin import UserAdmin,GroupAdmin

# Register your models here.
# admin.site.register(CustomUser, UserAdmin)
admin.site.register(Complete_Portfolio)
admin.site.register(PortfolioItem)
# admin.site.register(CustomUser)
@admin.register(AccessType)
class CustomGroupAdmin(GroupAdmin):
    model = AccessType
    fieldsets = GroupAdmin.fieldsets

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
        ('Basic Information', {'fields': ('roles','profileImage','portfolioVisibility','portfolio','accessType')}),
    )
    filter_horizontal = (
        "groups",
        "accessType",
    )
