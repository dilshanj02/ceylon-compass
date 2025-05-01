from django.contrib import admin
from .admin_reports import custom_admin_site
from django.shortcuts import redirect
from .models import Trip, TripPlan, EmergencyContact, Destination, Theme, Place, Review, Accommodation

@admin.register(Trip, site=custom_admin_site)
class TripAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "destination", "theme", "check_in", "check_out", "travelers", "budget")
    list_filter = ("destination", "theme", "check_in")
    search_fields = ("user__username", "destination__name", "theme__name")
    ordering = ("-check_in",)

@admin.register(TripPlan, site=custom_admin_site)
class TripPlanAdmin(admin.ModelAdmin):
    list_display = ("id", "trip", "created_at")
    search_fields = ("trip__destination__name",)
    ordering = ("-created_at",)

@admin.register(EmergencyContact, site=custom_admin_site)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ("id", "destination", "name", "service_type", "phone_number")
    list_filter = ("destination", "service_type")
    search_fields = ("name", "phone_number", "destination__name")

@admin.register(Destination, site=custom_admin_site)
class DestinationAdmin(admin.ModelAdmin):
    list_display = ("id", "name",)
    search_fields = ("name",)

@admin.register(Theme, site=custom_admin_site)
class ThemeAdmin(admin.ModelAdmin):
    list_display = ("id", "name",)
    search_fields = ("name",)

@admin.register(Place, site=custom_admin_site)
class PlaceAdmin(admin.ModelAdmin):
    list_display = ("id", "destination", "beautified_name", "theme", "rating", "num_reviews")
    list_filter = ("destination", "theme")
    search_fields = ("beautified_name", "destination__name", "theme__name")

@admin.register(Review, site=custom_admin_site)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "trip_plan", "rating", "created_at")
    search_fields = ("user__username", "trip_plan__trip__destination__name")
    ordering = ("-created_at",)

@admin.register(Accommodation, site=custom_admin_site)
class AccommodationAdmin(admin.ModelAdmin):
    list_display = ("id", "destination", "name", "category", "tier", "price_per_night_per_person", "rating")
    list_filter = ("destination", "category", "tier")
    search_fields = ("name", "destination__name", "category")


# Add a reports button
class ReportsAdminView(admin.ModelAdmin):
    def changelist_view(self, request, extra_context=None):
        return redirect("/admin/reports/")
    