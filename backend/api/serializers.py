from rest_framework import serializers
from datetime import date, timedelta
from .models import Trip

from .constants import DESTINATIONS, THEMES, ACCOMMODATION_COSTS, TRANSPORT_COSTS

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = "__all__"

    def validate(self, data):
        errors = {}

        destination = data.get("destination")
        theme = data.get("theme")
        check_in = data.get("check_in")
        check_out = data.get("check_out")
        travelers = data.get("travelers")
        transport = data.get("transport")
        accommodation = data.get("accommodation")
        budget = data.get("budget")

        MAX_TRIP_DAYS = 5 
        MAX_TRAVELERS = 4
        
        if destination not in DESTINATIONS:
            errors["destination"] = "Invalid destination selected."

        if theme not in THEMES:
            errors["theme"] = "Invalid trip theme."

        # Validate dates
        if check_in is None or check_out is None:
            errors["dates"] = "Check-in and Check-out dates are required."
        else:
            if check_in < date.today():
                errors["check_in"] = "Check-in date cannot be in the past."
            
            if check_out <= check_in:
                errors["check_out"] = "Check-out date must be after check-in date."

            if (check_out - check_in).days > MAX_TRIP_DAYS:
                errors["trip_duration"] = f"Trip duration cannot exceed {MAX_TRIP_DAYS} days."

        # Validate traveler count
        if travelers < 1 or travelers > MAX_TRAVELERS:
            errors["travelers"] = f"Number of travelers must be between 1 and {MAX_TRAVELERS}."

        if transport not in TRANSPORT_COSTS:
            errors["transport"] = "Invalid transport mode selected."

        if accommodation not in ACCOMMODATION_COSTS:
            errors["accommodation"] = "Invalid accommodation type selected."

        # Calulate minimum required budget
        num_days = (check_out - check_in).days
        transport_cost = TRANSPORT_COSTS[transport] * num_days # Transport cost considered as for the total travelers per day
        accommodation_cost = ACCOMMODATION_COSTS[accommodation] * num_days * travelers 
        food_cost = 2500 * num_days * travelers 
        misc_cost = 0.15 * (transport_cost + accommodation_cost + food_cost) 
        min_required_budget = transport_cost + accommodation_cost + food_cost + misc_cost

        # Validate budget
        if budget < min_required_budget:
            errors["budget"] = f"Minimum required budget is LKR {min_required_budget:.2f}."

        # Raise all validation errors at once
        if errors:
            raise serializers.ValidationError(errors)

        return data
        

