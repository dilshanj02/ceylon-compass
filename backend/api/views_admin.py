# backend/api/views_admin.py
from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.utils import timezone
from django.db import models
from datetime import timedelta
from .models import Trip, Accommodation, Destination, Theme

import csv
from django.http import HttpResponse

@staff_member_required
def reports_dashboard(request):
    today = timezone.now().date()
    last_30_days = today - timedelta(days=30)

    # Get Filter Inputs
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    selected_destination = request.GET.get('destination')
    selected_theme = request.GET.get('theme')

    # Get All Trips
    trips = Trip.objects.all()

    # Apply Filters
    if start_date:
        trips = trips.filter(check_in__gte=start_date)
    if end_date:
        trips = trips.filter(check_out__lte=end_date)
    if selected_destination:
        trips = trips.filter(destination__name__iexact=selected_destination)
    if selected_theme:
        trips = trips.filter(theme__name__iexact=selected_theme)

    total_trips = trips.count()

    trips_per_destination = trips.values('destination__name').annotate(count=models.Count('id')).order_by('-count')
    trips_by_theme = trips.values('theme__name').annotate(count=models.Count('id')).order_by('-count')

    # Trips by date
    trips_this_month = trips.filter(check_in__month=today.month).count()
    trips_last_30 = trips.filter(check_in__gte=last_30_days).count()

    # Average budget per destination
    avg_budget_per_destination = {}
    for trip in trips:
        dest = trip.destination.name
        avg_budget_per_destination.setdefault(dest, []).append(trip.budget)
    avg_budget_per_destination = {
        dest: sum(budgets) / len(budgets) for dest, budgets in avg_budget_per_destination.items()
    }

    # Popular destinations
    destination_counts = {}
    for trip in trips:
        dest = trip.destination.name
        destination_counts[dest] = destination_counts.get(dest, 0) + 1

    # Accommodation Preferences
    accommodation_counts = Accommodation.objects.values('category', 'tier').annotate(count=models.Count('id')).order_by('-count')

    # All Destinations and Themes for filter dropdowns
    all_destinations = Destination.objects.all()
    all_themes = Theme.objects.all()

    return render(request, "admin/reports.html", {
        "total_trips": total_trips,
        "trips_per_destination": trips_per_destination,
        "trips_by_theme": trips_by_theme,
        "trips_this_month": trips_this_month,
        "trips_last_30": trips_last_30,
        "avg_budget_per_destination": avg_budget_per_destination,
        "destination_counts": destination_counts,
        "accommodation_counts": accommodation_counts,
        "all_destinations": all_destinations,
        "all_themes": all_themes,
        "active_filters": {
            "start_date": start_date,
            "end_date": end_date,
            "destination": selected_destination,
            "theme": selected_theme,
        }
    })


@staff_member_required
def export_reports_csv(request):
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    destination = request.GET.get('destination')
    theme = request.GET.get('theme')

    trips = Trip.objects.all()

    if start_date:
        trips = trips.filter(check_in__gte=start_date)
    if end_date:
        trips = trips.filter(check_out__lte=end_date)
    if destination:
        trips = trips.filter(destination__name__iexact=destination)
    if theme:
        trips = trips.filter(theme__name__iexact=theme)

    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="trip_report.csv"'

    writer = csv.writer(response)
    writer.writerow([
        'User',
        'Destination',
        'Theme',
        'Check-in',
        'Check-out',
        'Travelers',
        'Budget'
    ])

    for trip in trips:
        writer.writerow([
            trip.user.username if trip.user else "Anonymous",
            trip.destination.name,
            trip.theme.name,
            trip.check_in,
            trip.check_out,
            trip.travelers,
            trip.budget,
        ])

    return response
