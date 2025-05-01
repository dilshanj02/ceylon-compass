import time
import json
import requests
from tqdm import tqdm
from django.core.management.base import BaseCommand
from django.conf import settings
from api.models import EmergencyContact, Destination

GOOGLE_PLACES_API_KEY = settings.GOOGLE_PLACES_API_KEY

EMERGENCY_TYPES = {
    "police": "Police Station",
    "hospital": "Hospital",
    "fire_station": "Fire Station",
    "embassy": "Embassy",
    "pharmacy": "Pharmacy",
}


class Command(BaseCommand):
    help = "Fetch emergency contacts (police, hospital, etc.) for destinations and save to DB"

    def handle(self, *args, **kwargs):
        destinations = ["Kandy", "Galle", "Ella", "Jaffna"]

        for destination_name in destinations:
            self.stdout.write(f"\n📍 Processing: {destination_name}")
            try:
                destination = Destination.objects.get(name__iexact=destination_name)
            except Destination.DoesNotExist:
                self.stderr.write(f"[!] Destination '{destination_name}' not found.")
                continue

            lat, lng = self.get_lat_lng(destination_name)

            for place_type, label in EMERGENCY_TYPES.items():
                self.stdout.write(f"🔍 Fetching {label}s...")

                places = self.fetch_places(lat, lng, place_type)
                for place in tqdm(places, desc=f"{label}"):
                    phone_number = self.get_place_phone(place["place_id"])

                    EmergencyContact.objects.update_or_create(
                        google_place_id=place["place_id"],
                        defaults={
                            "destination": destination,
                            "name": place.get("name"),
                            "lat": place["geometry"]["location"]["lat"],
                            "lng": place["geometry"]["location"]["lng"],
                            "service_type": label,
                            "phone_number": phone_number,
                            "description": place.get("vicinity", ""),
                        },
                    )

        self.stdout.write(self.style.SUCCESS("\n✅ Emergency contacts saved successfully."))

    def get_lat_lng(self, query):
        url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
        params = {"query": query, "key": GOOGLE_PLACES_API_KEY}
        res = requests.get(url, params=params).json()
        loc = res["results"][0]["geometry"]["location"]
        return loc["lat"], loc["lng"]

    def fetch_places(self, lat, lng, place_type, radius=8000, limit=10):
        url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        params = {
            "location": f"{lat},{lng}",
            "radius": radius,
            "type": place_type,
            "key": GOOGLE_PLACES_API_KEY,
        }

        results = []
        while True:
            res = requests.get(url, params=params).json()
            results.extend(res.get("results", []))
            if len(results) >= limit:
                return results[:limit]
            if "next_page_token" in res:
                time.sleep(2)
                params["pagetoken"] = res["next_page_token"]
            else:
                break
        return results

    def get_place_phone(self, place_id):
        url = "https://maps.googleapis.com/maps/api/place/details/json"
        params = {
            "place_id": place_id,
            "fields": "formatted_phone_number",
            "key": GOOGLE_PLACES_API_KEY,
        }
        try:
            res = requests.get(url, params=params).json()
            return res.get("result", {}).get("formatted_phone_number", "011-000-0000")
        except Exception as e:
            self.stderr.write(f"[!] Phone fetch error: {e}")
            return "011-000-0000"
