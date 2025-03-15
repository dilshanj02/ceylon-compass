from rest_framework import serializers
from datetime import date, timedelta
from .models import Trip

class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = "__all__"

    def validate(self, data):
        """Cross-field validation"""
        errors = {}

        destination = data.get("destination")
        theme = data.get("theme")
        check_in = data.get("check_in")
        check_out = data.get("check_out")
        travelers = data.get("travelers")
        transport = data.get("transport")
        accommodation = data.get("accommodation")
        budget = data.get("budget")

        # Valid destinations and themes
        valid_destinations = ["Colombo", "Kandy", "Galle", "Nuwara Eliya", "Ella", "Jaffna"]
        valid_themes = ["Adventure & Outdoors", "Leisure & Relaxation", "Culture & Heritage"]
        
        if destination not in valid_destinations:
            errors["destination"] = "Invalid destination selected."

        if theme not in valid_themes:
            errors["theme"] = "Invalid trip theme."

        # Validate dates
        if check_in is None or check_out is None:
            errors["dates"] = "Check-in and Check-out dates are required."
        else:
            if check_in < date.today():
                errors["check_in"] = "Check-in date cannot be in the past."
            
            if check_out <= check_in:
                errors["check_out"] = "Check-out date must be after check-in date."

            if (check_out - check_in).days > 5:
                errors["trip_duration"] = "Trip duration cannot exceed 5 days."

        # Validate traveler count
        if travelers < 1 or travelers > 4:
            errors["travelers"] = "Number of travelers must be between 1 and 4."

        # Validate transport and accommodation choices
        transport_costs = {
            "Public Transport": 2000,
            "Private Vehicle": 3500,
            "Rental Vehicle": 4500
        }
        accommodation_costs = {
            "Hotel": 5000,
            "Villa": 8000,
            "Guesthouse": 3500
        }

        if transport not in transport_costs:
            errors["transport"] = "Invalid transport mode selected."

        if accommodation not in accommodation_costs:
            errors["accommodation"] = "Invalid accommodation type selected."

        # Calulate minimum required budget
        num_days = (check_out - check_in).days
        transport_cost = transport_costs[transport] * num_days * travelers # 12,000
        accommodation_cost = accommodation_costs[accommodation] * num_days * travelers # 30,000
        food_cost = 2500 * num_days * travelers # 15,000
        misc_cost = 0.15 * (transport_cost + accommodation_cost + food_cost) # 8,550
        min_required_budget = transport_cost + accommodation_cost + food_cost + misc_cost

        # Validate budget
        if budget < min_required_budget:
            errors["budget"] = f"Minimum required budget is LKR {min_required_budget:.2f}."

        # Raise all validation errors at once
        if errors:
            raise serializers.ValidationError(errors)

        return data
        

