import requests
from django.core.management.base import BaseCommand
from api.models import Destination

GOOGLE_PLACES_API_KEY = "AIzaSyBkQxm4XRZUrzrYVYPNGj-tOUhL27uHi4A"

DESTINATION_NAMES = [
    "Colombo",
    "Kandy",
    "Galle",
    "Nuwara Eliya",
    "Ella",
    "Jaffna",
]

def fetch_lat_lon_from_google(name):
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        "query": name,
        "key": GOOGLE_PLACES_API_KEY
    }

    response = requests.get(url, params=params)
    data = response.json()

    if data.get("status") == "OK":
        location = data["results"][0]["geometry"]["location"]
        return location["lat"], location["lng"]
    else:
        raise Exception(f"❌ Failed to fetch location for {name}: {data.get('status')}")

class Command(BaseCommand):
    help = "Populates the Destination model using Google Places API for coordinates"

    def handle(self, *args, **kwargs):
        for name in DESTINATION_NAMES:
            try:
                lat, lon = fetch_lat_lon_from_google(name)
                destination, created = Destination.objects.get_or_create(
                    name=name,
                    defaults={"latitude": lat, "longitude": lon}
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f"✅ Added {name} ({lat}, {lon})"))
                else:
                    self.stdout.write(f"⏭️ Already exists: {name}")
            except Exception as e:
                self.stderr.write(self.style.ERROR(str(e)))