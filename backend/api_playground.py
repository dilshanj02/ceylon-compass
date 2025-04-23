import requests
import time
import vertexai
from vertexai.generative_models import GenerativeModel
import difflib
from typing import List, Dict, Tuple
import json
from tqdm import tqdm


GOOGLE_PLACES_API_KEY = "AIzaSyBkQxm4XRZUrzrYVYPNGj-tOUhL27uHi4A"

# Gemini init
vertexai.init(project="astute-synapse-457413-g1", location="us-central1")
gemini_model = GenerativeModel("gemini-2.5-flash-preview-04-17")

WANTED_PLACE_TYPES = {
    "tourist_attraction", "park", "museum", "art_gallery", "amusement_park",
    "zoo", "aquarium", "campground", "hindu_temple", "church",
    "mosque", "synagogue", "stadium", "night_club", "casino", "movie_theater"
}

BAD_PLACE_TYPES = {
    "restaurant", "lodging", "bar", "cafe", "convenience_store", "travel_agency",
    "hospital", "doctor", "school", "university", "police", "atm",
    "supermarket", "store", "shopping_mall", "furniture_store", "electronics_store",
    "beauty_salon", "car_rental", "taxi_stand", "transit_station", "train_station",
    "bus_station", "post_office", "insurance_agency", "car_repair", "pharmacy",
    "gas_station", "hardware_store", "laundry", "jewelry_store", "shoe_store"
}


def get_lat_lon(destination: str) -> Tuple[float, float]:
    """
    Fetch the latitude and longitude of a destination using Google Places Text Search.
    """
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        "query": destination,
        "key": GOOGLE_PLACES_API_KEY
    }
    res = requests.get(url, params=params).json()

    if res["status"] == "OK" and res["results"]:
        location = res["results"][0]["geometry"]["location"]
        return location["lat"], location["lng"]
    else:
        raise ValueError(f"Could not fetch lat/lon for destination: {destination}")


def is_valid_place(name: str, rating: float, types: List[str]) -> bool:
    """
    Determines if a place should be included based on type and rating.
    """
    name = name.lower()
    types_set = set(types)

    if len(name.split()) < 2:
        return False
    if types_set & BAD_PLACE_TYPES:
        return False
    if rating and rating < 3.5:
        return False
    return True


def is_duplicate(name: str, seen_names: set, cutoff: float = 0.85) -> bool:
    """
    Uses difflib to determine if a place name is too similar to one already seen.
    """
    for seen in seen_names:
        similarity = difflib.SequenceMatcher(None, name.lower(), seen).ratio()
        if similarity > cutoff:
            return True
    return False


def get_places_by_location(lat: float, lng: float, radius: int = 10000, limit: int = 60) -> List[Dict]:
    """
    Fetches tourist-relevant places near a given location, filtering out bad types and duplicates.
    """
    base_url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "type": "tourist_attraction",
        "key": GOOGLE_PLACES_API_KEY
    }

    all_results = []
    seen_names = set()

    while True:
        res = requests.get(base_url, params=params).json()
        places = res.get("results", [])

        for place in places:
            name = place.get("name", "Unknown")
            rating = place.get("rating", 0.0)
            types = place.get("types", [])
            place_id = place.get("place_id")
            lat = place.get("geometry", {}).get("location", {}).get("lat")
            lng = place.get("geometry", {}).get("location", {}).get("lng")
            total_reviews = place.get("user_ratings_total", 0)


            if not name or not lat or not lng:
                continue

            if not is_valid_place(name, rating, types):
                continue

            if is_duplicate(name, seen_names):
                continue

            seen_names.add(name.lower())
            all_results.append({
                "name": name,
                "place_id": place_id,
                "types": types,
                "rating": rating,
                "lat": lat,
                "lng": lng,
                "photo_reference": place.get("photos", [{}])[0].get("photo_reference"),
                "total_reviews": total_reviews
            })

            if len(all_results) >= limit:
                return all_results

        if "next_page_token" in res:
            time.sleep(2)
            params["pagetoken"] = res["next_page_token"]
        else:
            break

    return all_results


def enrich_place_with_ai(place: dict, destination: str) -> dict:
    name = place.get("name", "Unknown")
    types = ", ".join(place.get("types", []))
    rating = place.get("rating", "N/A")

    prompt = f"""
You are a smart assistant helping enrich tourist place data for a travel itinerary planner.

Given a place's name, types, and rating, return a strict JSON object like this (use double quotes only!):

{{
  "name": "Original Place Name",
  "beautified_name": "Improved display name",
  "description": "Short, friendly 1-2 sentence description",
  "theme": "Adventure & Outdoors" | "Culture & Heritage" | "Leisure & Relaxation" | "Unrelated"
}}

If the place is not suitable for a tourist itinerary (e.g., a travel service, accommodation, restaurant, taxi/tuk tuk, etc.), classify its theme as "Unrelated".

Rules:
- Always return strict JSON (double quotes, valid syntax)
- Do not include explanation, just the JSON

Destination: {destination}
Place:
- Name: {name}
- Types: {types}
- Rating: {rating}
"""

    try:
        response = gemini_model.generate_content(prompt)
        # Extract only the JSON part using curly braces
        json_start = response.text.find("{")
        json_end = response.text.rfind("}") + 1
        json_text = response.text[json_start:json_end]
        return json.loads(json_text)
    except Exception as e:
        print(f"[!] Failed to enrich place: {e}")
        return {
            "name": name,
            "beautified_name": name,
            "description": "",
            "theme": "Unrelated"
        }

destination = "Ella"
lat, lng = get_lat_lon(destination)

raw_places = get_places_by_location(lat, lng)
enriched_places = []
skipped_places = []

print(len(raw_places))

for place in tqdm(raw_places, desc="Enriching places"):
    # if place.get("total_reviews", 0) < 10:
    #     continue
    
    enriched_place = enrich_place_with_ai(place, destination)

    if enriched_place["theme"] != "Unrelated":

        # Merge original metadata
        enriched_place["google_place_id"] = place.get("place_id")
        enriched_place["lat"] = place.get("lat")
        enriched_place["lng"] = place.get("lng")
        enriched_place["rating"] = place.get("rating")
        enriched_place["types"] = place.get("types")
        enriched_place["photo_reference"] = place.get("photo_reference")
        enriched_place["total_reviews"] = place.get("total_reviews")

        enriched_places.append(enriched_place)
    else:
        skipped_places.append(enriched_place)

# Save enriched places to a JSON file
with open(f"{destination.lower()}_enriched_places.json", "w") as f:
    json.dump(enriched_places, f, indent=4)

# Save skipped places to a JSON file to review
with open(f"{destination.lower()}_skipped_places.json", "w") as f:
    json.dump(skipped_places, f, indent=4) 