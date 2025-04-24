from django.contrib import admin
from .models import Trip, TripPlan, EmergencyContact, Destination, Theme, Place, Review, Accommodation

admin.site.register(Trip)
admin.site.register(TripPlan)
admin.site.register(EmergencyContact)
admin.site.register(Destination)
admin.site.register(Theme)
admin.site.register(Place)
admin.site.register(Review)
admin.site.register(Accommodation)

