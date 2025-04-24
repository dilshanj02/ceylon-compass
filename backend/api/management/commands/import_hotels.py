import time
import json
import requests
from tqdm import tqdm
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.core.files.base import ContentFile
from django.conf import settings
from api.models import Accommodation, Destination
import vertexai
from vertexai.generative_models import GenerativeModel

# VertexAI Setup
vertexai.init(project="astute-synapse-457413-g1", location="us-central1")
gemini = GenerativeModel("gemini-2.5-flash-preview-04-17")

GOOGLE_PLACES_API_KEY = settings.GOOGLE_PLACES_API_KEY

class Command(BaseCommand):
    help = "Fetch and enrich hotel data for multiple destinations and insert directly into DB"

    def handle(self, *args, **options):
        destinations = ["Kandy"]  # Customize this list

        for destination_name in destinations:
            self.stdout.write(f"\n📍 Processing destination: {destination_name}")
            try:
                destination = Destination.objects.get(name__iexact=destination_name)
            except Destination.DoesNotExist:
                self.stderr.write(f"[!] Destination '{destination_name}' not found.")
                continue

            lat, lng = self.get_lat_lng(destination_name)
            raw_hotels = self.fetch_hotels(lat, lng)

            for hotel in tqdm(raw_hotels, desc=f"🏨 Enriching {destination_name} hotels"):
                enriched = self.enrich_with_ai(hotel, destination_name)
                if enriched["category"] == "Unrelated":
                    continue

                acco, created = Accommodation.objects.update_or_create(
                    google_place_id=hotel["place_id"],
                    defaults={
                        "destination": destination,
                        "name": enriched["name"],
                        "lat": hotel["geometry"]["location"]["lat"],
                        "lng": hotel["geometry"]["location"]["lng"],
                        "rating": hotel.get("rating"),
                        "types": hotel.get("types", []),
                        "photo_reference": hotel.get("photos", [{}])[0].get("photo_reference"),
                        "category": enriched["category"],
                        "tier": enriched["tier"],
                        "price_per_night_per_person": enriched["price_per_night_per_person"],
                    },
                )

                if acco.photo_reference and not acco.image:
                    image_data = self.download_image(acco.photo_reference, acco.name)
                    if image_data:
                        filename, content = image_data
                        acco.image.save(filename, ContentFile(content), save=True)

                self.stdout.write(f"{'🆕 Created' if created else '🔄 Updated'}: {acco.name}")

        self.stdout.write(self.style.SUCCESS("\n✅ All destinations processed successfully!"))

    def get_lat_lng(self, destination):
        url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
        res = requests.get(url, params={"query": destination, "key": GOOGLE_PLACES_API_KEY}).json()
        loc = res["results"][0]["geometry"]["location"]
        return loc["lat"], loc["lng"]

    def fetch_hotels(self, lat, lng, radius=10000, limit=30):
        base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        params = {
            "location": f"{lat},{lng}",
            "radius": radius,
            "type": "lodging",
            "key": GOOGLE_PLACES_API_KEY,
        }

        results = []
        while True:
            response = requests.get(base_url, params=params).json()
            results.extend(response.get("results", []))
            if len(results) >= limit:
                return results[:limit]
            if "next_page_token" in response:
                time.sleep(2)
                params["pagetoken"] = response["next_page_token"]
            else:
                break
        return results

    def enrich_with_ai(self, place, destination):
        prompt = f"""
You are a smart assistant helping classify hotels for a travel itinerary platform.

Given a hotel-like place’s name, types, rating, and location, return a strict JSON object with tier classification and price estimation.

Return format:
{{
  "name": "Original Place Name",
  "category": "Hotel" | "Villa" | "Resort" | "Guesthouse" | "Other",
  "tier": "Budget" | "Mid-range" | "Luxury",
  "price_per_night_per_person": 12000
}}

📌 Pricing Rules (in LKR):
- Budget: ≤ 8000
- Mid-range: 8001 - 15000
- Luxury: > 15000

Destination: {destination}
Hotel:
- Name: {place.get("name", "")}
- Types: {", ".join(place.get("types", []))}
- Rating: {place.get("rating", "N/A")}

Respond only with valid strict JSON.
"""
        try:
            res = gemini.generate_content(prompt)
            json_start = res.text.find("{")
            json_end = res.text.rfind("}") + 1
            return json.loads(res.text[json_start:json_end])
        except Exception as e:
            self.stderr.write(f"[!] AI Error: {e}")
            return {
                "name": place.get("name"),
                "category": "Unrelated",
                "tier": "Budget",
                "price_per_night_per_person": 0,
            }

    def download_image(self, photo_reference, place_name, maxwidth=800):
        base_url = "https://maps.googleapis.com/maps/api/place/photo"
        params = {
            "maxwidth": maxwidth,
            "photoreference": photo_reference,
            "key": GOOGLE_PLACES_API_KEY,
        }

        try:
            r = requests.get(base_url, params=params, allow_redirects=False, timeout=10)
            if r.status_code != 302:
                return None

            image_url = r.headers.get("Location")
            image_response = requests.get(image_url, timeout=10)
            if image_response.status_code != 200:
                return None

            filename = f"{slugify(place_name)}.jpg"
            return filename, image_response.content

        except requests.RequestException as e:
            self.stderr.write(f"Image fetch error for {place_name}: {e}")
            return None
