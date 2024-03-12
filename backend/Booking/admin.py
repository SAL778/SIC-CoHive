from django.contrib import admin
from django.contrib.admin import DateFieldListFilter

from .models import Resources, Booking

# Register your models here.
@admin.register(Resources)
class ResourcesAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'type')
    list_filter = ('name', 'type')
    search_fields = ('id', 'name', 'room_number', 'type')
    ordering = ('id', 'name', 'description', 'room_number', 'type')
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'room_number', 'type')
        }),
        ('Access Type', {
            'fields': ('access_type',)
        }),
    )
    filter_horizontal = (
        "access_type",
    )

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'start_time', 'end_time', 'resources', 'user')
    list_filter = ('resources', 'user','start_time','end_time',)
    search_fields = ('id', 'start_time', 'end_time', 'resources__name', 'user__username')
    ordering = ('id', 'start_time', 'end_time', 'resources', 'user')

