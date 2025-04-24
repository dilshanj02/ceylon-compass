from datetime import timedelta
from decimal import Decimal
from api.models import Place
from api.constants import (
    ACCOMMODATION_COSTS,
    TRANSPORT_COSTS,
    FOOD_COST_PER_DAY,
    MISC_COST_PERCENTAGE,
)

MAX_DAILY_VISIT_MINUTES = 180  # 6 hours

def generate_trip_plan(trip):
    destination = trip.destination.name
    theme = trip.theme.name
    check_in = trip.check_in
    check_out = trip.check_out
    transport = trip.transport
    accommodation_type = trip.accommodation_type
    accommodation_tier = trip.accommodation_tier
    travelers = trip.travelers
    budget = trip.budget

    num_days = (check_out - check_in).days

    places = list(
        Place.objects.filter(destination=trip.destination, theme=trip.theme)
        .order_by("-rating", "-num_reviews")
    )
    if not places:
        raise Exception("No suitable places found for this destination and theme.")

    # Budget breakdown
    accommodation_cost = Decimal(ACCOMMODATION_COSTS[accommodation_type][accommodation_tier]) * num_days * travelers
    transport_cost = Decimal(TRANSPORT_COSTS[transport]) * num_days
    food_cost = Decimal(FOOD_COST_PER_DAY) * num_days * travelers
    misc_cost = Decimal(MISC_COST_PERCENTAGE) * (accommodation_cost + transport_cost + food_cost)
    total_cost = accommodation_cost + transport_cost + food_cost + misc_cost
    remaining_budget = budget - total_cost

    # Create itinerary
    itinerary = []
    current_place_index = 0
    for i in range(num_days):
        date = check_in + timedelta(days=i)
        time_left = MAX_DAILY_VISIT_MINUTES
        daily_activities = []

        while current_place_index < len(places):
            place = places[current_place_index]
            duration = place.visit_duration or 60
            if time_left - duration >= 0:
                daily_activities.append({
                    "name": place.beautified_name,
                    "description": place.description,
                    "photo": place.get_photo_url(),
                    "lat": place.lat,
                    "lng": place.lng,
                    "duration": duration
                })
                time_left -= duration
                current_place_index += 1
            else:
                break

        itinerary.append({
            "date": date.strftime("%Y-%m-%d"),
            "activities": daily_activities,
            "budget_remaining": float(remaining_budget) / num_days
        })

    return {
        "destination": destination,
        "theme": theme,
        "itinerary": itinerary,
        "cost_breakdown": {
            "accommodation": float(accommodation_cost),
            "transport": float(transport_cost),
            "food": float(food_cost),
            "misc": float(misc_cost),
            "total": float(total_cost),
            "remaining_budget": f"{float(remaining_budget):.2f}"
        }
    }
