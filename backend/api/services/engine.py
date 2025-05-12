from datetime import timedelta
from decimal import Decimal
from api.models import Place, Accommodation
from api.constants import (
    TRANSPORT_COSTS,
    FOOD_COST_PER_DAY,
    MISC_COST_PERCENTAGE,
)

MAX_DAILY_VISIT_MINUTES = 180  # 3 hours

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

    # 1. Fetch and score accommodations
    accommodations = Accommodation.objects.filter(
        destination=destination,
        category=accommodation_type,
        tier=accommodation_tier
    )

    if not accommodations.exists():
        raise Exception("No matching accommodations available for your preferences.")

    def score(acc):
        return (
            (float(acc.rating or 0) * 2) -
            (float(acc.price_per_night_per_person) * 0.1)
        )

    def calculate_costs(accommodation_obj):
        acc_cost = Decimal(accommodation_obj.price_per_night_per_person) * num_days * travelers
        trans_cost = Decimal(TRANSPORT_COSTS[transport]) * num_days
        food_cost = Decimal(FOOD_COST_PER_DAY) * num_days * travelers
        misc_cost = Decimal(MISC_COST_PERCENTAGE) * (acc_cost + trans_cost + food_cost)
        total = acc_cost + trans_cost + food_cost + misc_cost
        remaining = budget - total
        return acc_cost, trans_cost, food_cost, misc_cost, total, remaining

    # 2. Try to find best scoring accommodation within budget
    sorted_accommodations = sorted(accommodations, key=score, reverse=True)

    best_accommodation = None
    best_total_cost = Decimal("-1")

    for acc in sorted_accommodations:
        acc_cost, trans_cost, food_cost_val, misc_cost_val, total, remaining = calculate_costs(acc)
        if total <= budget and total > best_total_cost:
            best_accommodation = acc
            accommodation_cost = acc_cost
            transport_cost = trans_cost
            food_cost = food_cost_val
            misc_cost = misc_cost_val
            total_cost = total
            remaining_budget = remaining
            best_total_cost = total

    # Fallback (very unlikely due to serializer check)
    if best_accommodation is None:
        best_accommodation = accommodations.order_by("price_per_night_per_person", "-rating").first()
        accommodation_cost, transport_cost, food_cost, misc_cost, total_cost, remaining_budget = calculate_costs(best_accommodation)

    # 3. Fetch places
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

        while current_place_index < len(places) and len(daily_activities) < 3:
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
            "name": best_accommodation.name,
            "category": best_accommodation.category,
            "tier": best_accommodation.tier,
            "price_per_night_per_person": best_accommodation.price_per_night_per_person,
            "photo": best_accommodation.get_photo_url(),
            "lat": best_accommodation.lat,
            "lng": best_accommodation.lng,
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
