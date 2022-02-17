from django.contrib import admin
from .models import pyConnect

# Register your models here.
class pyConnectAdmin(admin.ModelAdmin):
    list_display = ('link','keywords','result')

admin.site.register(pyConnect,pyConnectAdmin)