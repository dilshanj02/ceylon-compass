from django.contrib import admin
from .models import Trip, TripPlan, EmergencyContact

admin.site.register(Trip)
admin.site.register(TripPlan)
admin.site.register(EmergencyContact)

