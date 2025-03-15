from datetime import timedelta
from decimal import Decimal

from api.constants import ACCOMMODATION_COSTS, TRANSPORT_COSTS

def generate_trip_plan(trip):
    num_days = (trip.check_out - trip.check_in).days
    plan = []

    activities_by_theme = {
        "Adventure & Outdoors": ["Hiking", "Wildlife Safari", "Water Sports"],
        "Leisure & Relaxation": ["Beach Day", "Spa & Wellness", "Scenic Drive"],
        "Culture & Heritage": ["Temple Visit", "Museum Tour", "Local Market Visit"]
    }
    
    activities = activities_by_theme.get(trip.theme, ["General Sightseeing"])

    # Budget distribution
    daily_budget = trip.budget / num_days
    accommodation_cost = ACCOMMODATION_COSTS[trip.accommodation] * num_days * trip.travelers
    transport_cost = TRANSPORT_COSTS[trip.transport] * num_days
    food_cost = 2500 * num_days * trip.travelers
    misc_cost = Decimal(0.15) * (accommodation_cost + transport_cost + food_cost)

    remaining_budget = trip.budget - (accommodation_cost + transport_cost + food_cost + misc_cost)

    for i in range(num_days):
        date = trip.check_in + timedelta(days=i)
        activity = activities[i % len(activities)] # Cycle through activities

        plan.append({
            "date": date.strftime("%Y-%m-%d"),
            "activity": activity,
            "budget_remaining": remaining_budget / num_days
        })

    return {
        "destination": trip.destination,
        "theme": trip.theme,
        "days": plan
    }