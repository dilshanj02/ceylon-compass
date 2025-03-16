from datetime import timedelta
from decimal import Decimal

from api.constants import ACCOMMODATION_COSTS, TRANSPORT_COSTS, ACTIVITIES_BY_DESTINATION_THEME, FOOD_COST_PER_DAY, MISC_COST_PERCENTAGE

def get_activities(destination, theme):
    return ACTIVITIES_BY_DESTINATION_THEME.get(destination, {}).get(theme, [])

def generate_trip_plan(trip):
    destination = trip.destination
    theme = trip.theme
    check_in = trip.check_in
    check_out = trip.check_out
    transport = trip.transport
    accommodation_type = trip.accommodation_type
    accommodation_tier = trip.accommodation_tier
    travelers = trip.travelers
    budget = trip.budget

    num_days = (check_out - check_in).days
    plan = []
    
    activities = get_activities(destination, theme)

    # Budget distribution
    accommodation_cost = Decimal(ACCOMMODATION_COSTS[accommodation_type][accommodation_tier]) * num_days * travelers
    transport_cost = Decimal(TRANSPORT_COSTS[transport]) * num_days
    food_cost = Decimal(FOOD_COST_PER_DAY) * num_days * travelers
    misc_cost = Decimal(MISC_COST_PERCENTAGE) * (accommodation_cost + transport_cost + food_cost)

    total_cost = accommodation_cost + food_cost + transport_cost + misc_cost
    remaining_budget = budget - total_cost

    for i in range(num_days):
        date = check_in + timedelta(days=i)
        activity = activities[i % len(activities)] # Cycle through activities

        plan.append({
            "date": date.strftime("%Y-%m-%d"),
            "activity": activity,
            "budget_remaining": remaining_budget / num_days
        })

    return {
        "destination": destination,
        "theme": theme,
        "days": plan,
        "cost_breakdown": {
            "accommodation": accommodation_cost,
            "transport": transport_cost,
            "food": food_cost,
            "misc": misc_cost,
            "total": total_cost,
            "remaining_budget": remaining_budget
        }
    }

