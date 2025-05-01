import time
import json
import requests
from tqdm import tqdm
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.core.files.base import ContentFile
from django.conf import settings
from api.models import Place, Destination, Theme
import vertexai
from vertexai.generative_models import GenerativeModel

# VertexAI setup
vertexai.init(project="astute-synapse-457413-g1", location="us-central1")
gemini = GenerativeModel("gemini-2.5-flash-preview-04-17")

GOOGLE_PLACES_API_KEY = settings.GOOGLE_PLACES_API_KEY

class Command(BaseCommand):
    help = "Fetch and enrich tourist places for multiple destinations and insert into Place model"

    def handle(self, *args, **options):
        destinations = ["Kandy", "Galle", "Ella", "Jaffna"]  # Customize as needed

        for destination_name in destinations:
            self.stdout.write(f"\n📍 Processing: {destination_name}")
            try:
                destination = Destination.objects.get(name__iexact=destination_name)
            except Destination.DoesNotExist:
                self.stderr.write(f"[!] Destination '{destination_name}' not found.")
                continue

            lat, lng = self.get_lat_lng(destination_name)
            raw_places = self.fetch_places(lat, lng)

            for place in tqdm(raw_places, desc=f"✨ Enriching {destination_name} places"):
                enriched = self.enrich_place_with_ai(place, destination_name)
                if enriched["theme"] == "Unrelated":
                    continue

                theme_obj, _ = Theme.objects.get_or_create(name=enriched["theme"])

                place_obj, created = Place.objects.update_or_create(
                    google_place_id=place["place_id"],
                    defaults={
                        "destination": destination,
                        "theme": theme_obj,
                        "name": enriched["name"],
                        "beautified_name": enriched["beautified_name"],
                        "description": enriched["description"],
                        "visit_duration": enriched["visit_duration"],
                        "lat": place["geometry"]["location"]["lat"],
                        "lng": place["geometry"]["location"]["lng"],
                        "rating": place.get("rating"),
                        "num_reviews": place.get("user_ratings_total", 0),
                        "types": place.get("types", []),
                        "photo_reference": place.get("photos", [{}])[0].get("photo_reference"),
                    },
                )

                if place_obj.photo_reference and not place_obj.image:
                    result = self.download_image(place_obj.photo_reference, place_obj.name)
                    if result:
                        filename, content = result
                        place_obj.image.save(filename, ContentFile(content), save=True)

                self.stdout.write(f"{'🆕 Created' if created else '🔄 Updated'}: {place_obj.name}")

        self.stdout.write(self.style.SUCCESS("\n✅ All places processed successfully."))

    def get_lat_lng(self, destination):
        url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
        res = requests.get(url, params={"query": destination, "key": GOOGLE_PLACES_API_KEY}).json()
        loc = res["results"][0]["geometry"]["location"]
        return loc["lat"], loc["lng"]

    def fetch_places(self, lat, lng, radius=10000, limit=60):
        base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
        params = {
            "location": f"{lat},{lng}",
            "radius": radius,
            "type": "tourist_attraction",
            "key": GOOGLE_PLACES_API_KEY,
        }

        seen = set()
        results = []

        while True:
            res = requests.get(base_url, params=params).json()
            for place in res.get("results", []):
                name = place.get("name", "").lower()
                if name in seen or not place.get("geometry"): continue
                seen.add(name)
                results.append(place)
                if len(results) >= limit: return results[:limit]

            if "next_page_token" in res:
                time.sleep(2)
                params["pagetoken"] = res["next_page_token"]
            else:
                break
        return results

    def enrich_place_with_ai(self, place, destination):
        name = place.get("name", "")
        types = ", ".join(place.get("types", []))
        rating = place.get("rating", "N/A")

        prompt = f"""
You are a smart assistant helping enrich tourist place data for a travel itinerary planner.

Given a place's name, types, and rating, return a strict JSON object like this (use double quotes only!):

{{
  "name": "Original Place Name",
  "beautified_name": "Improved display name",
  "description": "Short, friendly 1-2 sentence description",
  "theme": "Adventure & Outdoors" | "Culture & Heritage" | "Leisure & Relaxation" | "Unrelated",
  "visit_duration": 90  // in minutes, estimated based on the place type and theme
}}

If the place is not suitable for a tourist itinerary (e.g., a travel service, accommodation, restaurant, taxi/tuk tuk, etc.), classify its theme as "Unrelated" and return 0 for visit_duration.
If the place name includes a person's name like "John's Cafe", or if it contains non-English characters like "تلة جوزة ادم", classify its theme as "Unrelated" and return 0 for visit_duration.

Estimate visit_duration using common sense:
- Hike = 180-300 minutes
- Viewpoint = 60-90 minutes
- Museum = 60–120 minutes
- Temple = 60–120 minutes
- Waterfall = 60–90 minutes
- Garden/Park = 90–120 minutes
- Scenic bridge = 45–60 minutes

Rules:
- Always return valid strict JSON (double quotes only)
- No explanation, just the JSON

Destination: {destination}
Place:
- Name: {name}
- Types: {types}
- Rating: {rating}
"""

        try:
            res = gemini.generate_content(prompt)
            json_start = res.text.find("{")
            json_end = res.text.rfind("}") + 1
            return json.loads(res.text[json_start:json_end])
        except Exception as e:
            self.stderr.write(f"[!] AI error: {e}")
            return {
                "name": name,
                "beautified_name": name,
                "description": "",
                "theme": "Unrelated",
                "visit_duration": 0,
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
