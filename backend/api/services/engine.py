from datetime import timedelta
from decimal import Decimal
from api.models import Place, Accommodation
from api.constants import (
    TRANSPORT_COSTS,
    FOOD_COST_PER_DAY,
    MISC_COST_PERCENTAGE,
)

MAX_DAILY_VISIT_MINUTES = 180  # 6 hours

def generate_trip_plan(trip):
    destination = trip.destination
    theme = trip.theme
    check_in = trip.check_in
    check_out = trip.check_out
    transport = trip.transport
    travelers = trip.travelers
    budget = trip.budget
    accommodation_type = trip.accommodation_type
    accommodation_tier = trip.accommodation_tier

    num_days = (check_out - check_in).days

    # 1. Fetch suitable accommodation
    accommodations = Accommodation.objects.filter(
        destination=destination,
        category=accommodation_type,
        tier=accommodation_tier
    ).order_by("price_per_night_per_person", "-rating")

    if not accommodations.exists():
        raise Exception("No matching accommodations available for your preferences.")

    accommodation = accommodations.first()

    # 2. Budget breakdown (using real price)
    accommodation_cost = Decimal(accommodation.price_per_night_per_person) * num_days * travelers
    transport_cost = Decimal(TRANSPORT_COSTS[transport]) * num_days
    food_cost = Decimal(FOOD_COST_PER_DAY) * num_days * travelers
    misc_cost = Decimal(MISC_COST_PERCENTAGE) * (accommodation_cost + transport_cost + food_cost)
    total_cost = accommodation_cost + transport_cost + food_cost + misc_cost
    remaining_budget = budget - total_cost

    if remaining_budget < 0:
        raise Exception("Budget is too low for the selected options.")

    # 3. Fetch places for itinerary
    places = list(
        Place.objects.filter(destination=destination, theme=theme)
        .order_by("-rating", "-num_reviews")
    )
    if not places:
        raise Exception("No suitable places found for this destination and theme.")

    # 4. Create itinerary
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

    # 5. Return structured plan
    return {
        "destination": destination.name,
        "theme": theme.name,
        "accommodation": {
            "name": accommodation.name,
            "category": accommodation.category,
            "tier": accommodation.tier,
            "price_per_night_per_person": accommodation.price_per_night_per_person,
            "photo": accommodation.get_photo_url(),
            "lat": accommodation.lat,
            "lng": accommodation.lng,
        },
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
