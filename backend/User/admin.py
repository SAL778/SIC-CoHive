from django.contrib import admin
from .models import CustomUser , Complete_Portfolio, PortfolioItem, AccessType, Education_Field
from django.contrib.auth.admin import UserAdmin,GroupAdmin

# Register your models here.
# admin.site.register(CustomUser, UserAdmin)
#admin.site.register(Complete_Portfolio)
#admin.site.register(PortfolioItem)
#admin.site.register(Education_Field)
# admin.site.register(CustomUser)

@admin.register(Complete_Portfolio)
class Complete_PortfolioAdmin(admin.ModelAdmin):
    list_display = ('id', 'user',)
    list_filter = ('user',)
    search_fields = ('id', 'user__username',)
    ordering = ('id', 'user',)

@admin.register(PortfolioItem)
class PortfolioItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'title',)
    search_fields = ('id', 'title',)
    list_filter = ('portfolio__user__username',)
    ordering = ('id', 'title',)

@admin.register(Education_Field)
class Education_FieldAdmin(admin.ModelAdmin):
    list_display = ('id', 'user')
    list_filter = ('user',)
    search_fields = ('id', 'user__username',)
    ordering = ('id', 'user',)

@admin.register(AccessType)
class CustomGroupAdmin(GroupAdmin):
    model = AccessType
    fieldsets = GroupAdmin.fieldsets
    search_fields = ('name',)
    ordering = ('name',)

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
