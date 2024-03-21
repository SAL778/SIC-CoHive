from django.contrib import admin
from .models import CustomUser, Complete_Portfolio, PortfolioItem, AccessType, Flair_Roles, AppLink
from django.contrib.auth.admin import UserAdmin, GroupAdmin
import csv
from django.http import HttpResponse


# Register your models here.
# admin.site.register(CustomUser, UserAdmin)
# admin.site.register(Complete_Portfolio)
# admin.site.register(PortfolioItem)
# admin.site.register(Education_Field)
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


def export_to_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="users.csv"'

    writer = csv.writer(response)
    writer.writerow(['Email', 'Name'])

    for user in queryset:
        writer.writerow([user.email, user.first_name + ' ' + user.last_name])

    return response


export_to_csv.short_description = 'Export to CSV'


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    fieldsets = UserAdmin.fieldsets + (
        ('Basic Information', {'fields': ( 'profileImage', 'portfolioVisibility', 'portfolio', 'accessType','flair_roles','education')}),
    )
    filter_horizontal = (
        "groups",
        "accessType",
        'flair_roles'
    )
    actions = [export_to_csv]


admin.site.register(Flair_Roles)

admin.site.register(AppLink)
