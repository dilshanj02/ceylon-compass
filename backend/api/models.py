from django.db import models
from django.contrib.auth.models import User

class Trip(models.Model):
    # user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trips")
    destination = models.CharField(max_length=50)
    theme = models.CharField(max_length=50)
    check_in = models.DateField()
    check_out = models.DateField()
    transport = models.CharField(max_length=50)
    accommodation = models.CharField(max_length=50)
    travelers = models.PositiveIntegerField()
    budget = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.destination}"
