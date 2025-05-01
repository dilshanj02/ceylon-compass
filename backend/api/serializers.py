from rest_framework import serializers
from datetime import date
from decimal import Decimal
from django.contrib.auth.models import User
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueValidator

from .models import Trip, TripPlan, Review, EmergencyContact, Destination, Theme, Place, Accommodation
from .constants import ACCOMMODATION_COSTS, TRANSPORT_COSTS, FOOD_COST_PER_DAY, MISC_COST_PERCENTAGE


class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = "__all__"


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = "__all__"


class PlaceSerializer(serializers.ModelSerializer):
    destination = serializers.StringRelatedField()
    theme = serializers.StringRelatedField()
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Place
        fields = [
            "id",
            "google_place_id",
            "name",
            "beautified_name",
            "description",
            "theme",
            "destination",
            "lat",
            "lng",
            "rating",
            "num_reviews",
            "types",
            "photo_url"
        ]

    def get_photo_url(self, obj):
        if obj.image:
            return obj.image.url
        elif obj.photo_reference:
            return obj.get_photo_url()
        return "/static/images/placeholder.jpg"

class AccommodationSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Accommodation
        fields = [
            "id",
            "google_place_id",
            "name",
            "lat",
            "lng",
            "rating",
            "types",
            "photo_reference",
            "photo_url",
            "category",
            "tier",
            "price_per_night_per_person",
            "destination",
        ]

    def get_photo_url(self, obj):
        if obj.image:
            return obj.image.url
        elif obj.photo_reference:
            return obj.get_photo_url()
        return "/static/images/placeholder.jpg"


class RegisterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        required = True,
        validators = [
            UniqueValidator(queryset=User.objects.all(), message="User with this username already exists")
        ]
    )
    email = serializers.EmailField(
        required=True,
        validators=[
            UniqueValidator(queryset=User.objects.all(), message="User with this email already exists")
        ]
    )
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        if User.objects.filter(username=validated_data["username"]).exists():
            raise ValidationError({"username": "Username is already taken."})

        if User.objects.filter(email=validated_data["email"]).exists():
            raise ValidationError({"email": "Email is already taken."})

        user = User.objects.create_user(
            username = validated_data["username"],
            email = validated_data["email"],
            password = validated_data["password"]
        )
        return user


class TripSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    destination_name = serializers.CharField(source="destination.name", read_only=True)
    theme_name = serializers.CharField(source="theme.name", read_only=True)

    class Meta:
        model = Trip
        fields = [
            "id", "destination", "destination_name",
            "theme", "theme_name", "check_in", "check_out",
            "transport", "accommodation_type", "accommodation_tier",
            "travelers", "budget", "user"
        ]

    def validate(self, data):
        errors = {}

        check_in = data.get("check_in")
        check_out = data.get("check_out")
        travelers = data.get("travelers")
        transport = data.get("transport")
        accommodation_type = data.get("accommodation_type")
        accommodation_tier = data.get("accommodation_tier")
        budget = data.get("budget")
        destination = data.get("destination")

        MAX_TRIP_DAYS = 5
        MAX_TRAVELERS = 4

        # ✅ Validate check-in/check-out dates
        if check_in is None or check_out is None:
            errors["dates"] = "Check-in and Check-out dates are required."
        else:
            if check_in < date.today():
                errors["check_in"] = "Check-in date cannot be in the past."
            if check_out <= check_in:
                errors["check_out"] = "Check-out date must be after check-in."
            if (check_out - check_in).days > MAX_TRIP_DAYS:
                errors["trip_duration"] = f"Trip duration cannot exceed {MAX_TRIP_DAYS} days."

        # ✅ Validate number of travelers
        if travelers is None:
            errors["travelers"] = "Number of travelers is required."
        elif travelers < 1 or travelers > MAX_TRAVELERS:
            errors["travelers"] = f"Number of travelers must be between 1 and {MAX_TRAVELERS}."

        # ✅ Accommodation cost from DB
        accommodation_cost = Decimal("0.0")
        num_days = (check_out - check_in).days if check_in and check_out else 0

        if destination and accommodation_type and accommodation_tier and num_days > 0:
            qs = Accommodation.objects.filter(
                destination=destination,
                category=accommodation_type,
                tier=accommodation_tier
            ).order_by("price_per_night_per_person")

            if not qs.exists():
                errors["accommodation"] = f"No available {accommodation_tier} {accommodation_type} in {destination}."
            else:
                price_per_person = Decimal(qs.first().price_per_night_per_person)
                accommodation_cost = price_per_person * num_days * travelers

        # ✅ Calculate remaining components
        if not errors and num_days > 0:
            transport_cost = Decimal(TRANSPORT_COSTS[transport]) * num_days
            food_cost = Decimal(FOOD_COST_PER_DAY) * num_days * travelers
            misc_cost = Decimal(MISC_COST_PERCENTAGE) * (transport_cost + accommodation_cost + food_cost)
            min_required_budget = transport_cost + accommodation_cost + food_cost + misc_cost

            if budget < min_required_budget:
                errors["budget"] = f"Minimum required budget is LKR {min_required_budget:.2f}."

        if errors:
            raise serializers.ValidationError(errors)

        return data

    def create(self, validated_data):
        request = self.context.get("request", None)
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        return super().create(validated_data)
        

class TripPlanSerializer(serializers.ModelSerializer):
    trip = TripSerializer()
    cost_breakdown = serializers.SerializerMethodField()
    itinerary = serializers.SerializerMethodField()
    # accommodation = serializers.SerializerMethodField()
    class Meta:
        model = TripPlan
        fields = "__all__"

    def get_cost_breakdown(self, obj):
        cost = obj.cost_breakdown
        formatted_cost = {}

        for key, value in cost.items():
            try:
                formatted_cost[key] = f"{float(value):.2f}"
            except ValueError:
                formatted_cost[key] = value

        return formatted_cost
    
    def get_itinerary(self, obj):
        itinerary = obj.itinerary
        formatted_itinerary = []

        for item in itinerary:
            formatted_item = item.copy()

            try:
                formatted_item["budget_remaining"] = f"{float(item["budget_remaining"]):.2f}"
            except (ValueError, TypeError):
                pass

            formatted_itinerary.append(formatted_item)

        return formatted_itinerary
    

class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)
    username = serializers.CharField(source='user.username', read_only=True)
    destination = serializers.CharField(source='trip_plan.trip.destination', read_only=True)
    class Meta:
        model = Review
        fields = '__all__'

    def create(self, validated_data):
        request = self.context.get("request", None)
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        return super().create(validated_data)
    

class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = "__all__"