import requests
import time
import vertexai
from vertexai.generative_models import GenerativeModel
import json
from typing import Tuple, List
from tqdm import tqdm
from django.conf import settings

GOOGLE_PLACES_API_KEY = "AIzaSyBkQxm4XRZUrzrYVYPNGj-tOUhL27uHi4A"

# Gemini init
vertexai.init(project="astute-synapse-457413-g1", location="us-central1")
gemini_model = GenerativeModel("gemini-2.5-flash-preview-04-17")


def get_lat_lng(destination: str) -> Tuple[float, float]:
    res = requests.get("https://maps.googleapis.com/maps/api/place/textsearch/json", params={
        "query": destination,
        "key": GOOGLE_PLACES_API_KEY
    }).json()

    location = res["results"][0]["geometry"]["location"]
    return location["lat"], location["lng"]

def fetch_hotels(lat: float, lng: float, radius: int = 10000, limit: int = 20) -> List[dict]:
    base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "type": "lodging",
        "key": GOOGLE_PLACES_API_KEY
    }

    all_results = []

    while True:
        response = requests.get(base_url, params=params).json()
        results = response.get("results", [])

        for hotel in results:
            all_results.append(hotel)
            if len(all_results) >= limit:
                return all_results  # ✅ Stop if limit reached

        if "next_page_token" in response:
            time.sleep(2)  # Google requires short wait before using next_page_token
            params["pagetoken"] = response["next_page_token"]
        else:
            break

    return all_results

def enrich_with_ai(place: dict, destination: str) -> dict:
    name = place.get("name", "")
    rating = place.get("rating", 0)
    types = ", ".join(place.get("types", []))

    prompt = f"""
You are a smart assistant helping classify hotels for a travel itinerary platform.

Given a hotel-like place’s name, types, rating, and location, return a strict JSON object with tier classification and price estimation.

✅ Use this format (must be valid JSON with double quotes only):

{{
  "name": "Original Place Name",
  "category": "Hotel" | "Villa" | "Resort" | "Guesthouse" | "Other",
  "tier": "Budget" | "Mid-range" | "Luxury",
  "price_per_night_per_person": 12000
}}

💡 Pricing Rules (in LKR):
- "Budget": 8000 or lower
- "Mid-range": between 8001 and 15000
- "Luxury": 15001 or higher

📌 Guidelines:
- Choose the `"category"` based on types and name:
  - If it includes "villa" → "Villa"
  - If it includes "resort" → "Resort"
  - If it includes "guest house", "guesthouse", "inn", "bnb" → "Guesthouse"
  - Otherwise, default to "Hotel"

- Use the rating and place type to infer `"tier"`:
  - Low ratings (under 4.0) and generic names = "Budget"
  - High ratings (4.3+) and luxurious-sounding names = "Luxury"
  - Others = "Mid-range"

- Adjust price_per_night_per_person using intuition based on tier and rating.
- Avoid unrealistic pricing — stay within the given LKR range.

📍 Destination: {destination}
🏨 Hotel:
- Name: {name}
- Types: {", ".join(types)}
- Rating: {rating}

❗Return only the JSON — no comments, no explanation.
"""

    try:
        res = gemini_model.generate_content(prompt)
        json_start = res.text.find("{")
        json_end = res.text.rfind("}") + 1
        return json.loads(res.text[json_start:json_end])
    except Exception as e:
        print(f"[!] AI Error for {name}: {e}")
        return {
            "category": "Unrelated",
            "tier": "Budget",
            "price_per_night_per_person": 0
        }

def process_hotels(destination: str):
    lat, lng = get_lat_lng(destination)
    raw_hotels = fetch_hotels(lat, lng)

    enriched = []
    for hotel in tqdm(raw_hotels, desc="Enriching accommodations"):
        enriched_data = enrich_with_ai(hotel, destination)
        if enriched_data["category"] != "Unrelated":
            enriched_data.update({
                "google_place_id": hotel.get("place_id"),
                "name": hotel.get("name"),
                "rating": hotel.get("rating"),
                "types": hotel.get("types"),
                "lat": hotel["geometry"]["location"]["lat"],
                "lng": hotel["geometry"]["location"]["lng"],
                "photo_reference": hotel.get("photos", [{}])[0].get("photo_reference")
            })
            enriched.append(enriched_data)

    with open(f"{destination.lower()}_accommodations.json", "w") as f:
        json.dump(enriched, f, indent=2)
    print(f"✅ Saved {len(enriched)} enriched accommodations to JSON")

# Example:
process_hotels("Kandy")
