from django.contrib import admin
from .models import Trip, TripPlan, EmergencyContact, Destination, Theme

admin.site.register(Trip)
admin.site.register(TripPlan)
admin.site.register(EmergencyContact)
admin.site.register(Destination)
admin.site.register(Theme)

