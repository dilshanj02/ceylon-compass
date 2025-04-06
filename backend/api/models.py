from django.db import models
from django.contrib.auth.models import User

class Trip(models.Model):
    DESTINATION_CHOICES = [
        ("Colombo", "Colombo"),
        ("Kandy", "Kandy"),
        ("Galle", "Galle"),
        ("Nuwara Eliya", "Nuwara Eliya"),
        ("Ella", "Ella"),
        ("Jaffna", "Jaffna")
    ]
    
    THEME_CHOICES = [
        ("Adventure & Outdoors", "Adventure & Outdoors"),
        ("Leisure & Relaxation", "Leisure & Relaxation"),
        ("Culture & Heritage", "Culture & Heritage")
    ]

    TRANSPORT_CHOICES = [
        ("Private", "Private"),
        ("Public", "Public"),
        ("Rental", "Rental")
    ]
    
    ACCOMMODATION_TYPE_CHOICES = [
            ("Hotel", "Hotel"),
            ("Villa", "Villa"),
            ("Guesthouse", "Guesthouse"),
            ("Resort", "Resort")
        ]

    ACCOMMODATION_TIER_CHOICES = [
        ("Luxury", "Luxury"),
        ("Mid-range", "Mid-range"),
        ("Budget", "Budget")
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='trips')
    destination = models.CharField(max_length=50, choices=DESTINATION_CHOICES)
    theme = models.CharField(max_length=50, choices=THEME_CHOICES)
    check_in = models.DateField()
    check_out = models.DateField()
    transport = models.CharField(max_length=50, choices=TRANSPORT_CHOICES)
    accommodation_type = models.CharField(max_length=50, choices=ACCOMMODATION_TYPE_CHOICES)
    accommodation_tier = models.CharField(max_length=50, choices=ACCOMMODATION_TIER_CHOICES)
    travelers = models.PositiveIntegerField()
    budget = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.destination} - {self.theme}"

class TripPlan(models.Model):
    trip = models.OneToOneField(Trip, on_delete=models.CASCADE, related_name="plan")
    created_at = models.DateTimeField(auto_now_add=True)
    itinerary = models.JSONField()
    cost_breakdown = models.JSONField()

    def __str__(self):
        return f"{self.created_at} - {self.trip.destination}"

class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    trip_plan = models.ForeignKey("TripPlan", on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Review by {self.user.username} for {self.destination}"
    

class EmergencyContact(models.Model):
    DESTINATION_CHOICES = [
        ("Colombo", "Colombo"),
        ("Kandy", "Kandy"),
        ("Galle", "Galle"),
        ("Nuwara Eliya", "Nuwara Eliya"),
        ("Ella", "Ella"),
        ("Jaffna", "Jaffna")
    ]

    location = models.CharField(max_length=100, choices=DESTINATION_CHOICES)
    service_type = models.CharField(max_length=100)
    name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.service_type} - {self.name} ({self.location})"