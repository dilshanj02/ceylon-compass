import requests
import time
import vertexai
from vertexai.generative_models import GenerativeModel
import difflib

BAD_KEYWORDS = [
    "taxi", "tuk tuk", "tour", "guide", "cab", "hotel",
    "resort", "guesthouse", "restaurant", "shop", "lodge", "travel agency"
]

MIN_NAME_TOKENS = 2
MIN_RATING = 3.5

GOOGLE_PLACES_API_KEY = "AIzaSyBkQxm4XRZUrzrYVYPNGj-tOUhL27uHi4A"

vertexai.init(project="astute-synapse-457413-g1", location="us-central1")

gemini_model = GenerativeModel("gemini-2.5-flash-preview-04-17")

def beautify_place_name_with_ai(name, types):
    prompt = f"""
You are a smart travel assistant. Your job is to improve tourist place names to sound clear and attractive.

Original name: {name}
Types: {', '.join(types)}

Give a clean, user-friendly version of the name that could appear in an app.
Do not add extra info — just improve the name formatting.
"""
    response = gemini_model.generate_content(prompt)
    return response.text.strip()


def deduplicate_places(places, cutoff=0.8):
    seen = []
    deduped = []

    for place in places:
        name = place["name"]

        # Check if this name is too similar to one we've already accepted
        if any(difflib.SequenceMatcher(None, name.lower(), s.lower()).ratio() > cutoff for s in seen):
            continue  # it's a near-duplicate, skip it

        seen.append(name)
        deduped.append(place)

    return deduped


def filter_place(place: dict) -> bool:
    """
    Filters a place based on custom rules.
    Returns True if the place is a good match, False if it should be skipped.
    """

    name = place.get("name", "").lower()
    theme = place.get("theme", "Unrelated")
    rating = place.get("rating", 0.0)

    if len(name.split()) < MIN_NAME_TOKENS:
        return False

    if any(kw in name for kw in BAD_KEYWORDS):
        return False

    if theme == "Unrelated":
        return False

    if rating and rating < MIN_RATING:
        return False

    return True


def classify_place_theme(place: dict) -> str:
    """
    Classifies a Google Place into a travel theme using Gemini Flash.
    Returns: One of "Adventure & Outdoors", "Leisure & Relaxation", "Culture & Heritage", or "Unrelated"
    """
    name = place.get("name", "Unknown")
    types = ", ".join(place.get("types", []))
    description = place.get("description", "No description available.")

    prompt = f"""
Classify the following place into one of the following travel themes:
- Adventure & Outdoors
- Leisure & Relaxation
- Culture & Heritage
- Unrelated

Only return ONE of the above options.

Place Name: {name}
Types: {types}
Description: {description}
"""

    try:
        response = gemini_model.generate_content(prompt)
        result = response.text.strip()

        # Sanitize result
        result = result.splitlines()[0].strip()
        if result not in [
            "Adventure & Outdoors",
            "Leisure & Relaxation",
            "Culture & Heritage",
            "Unrelated"
        ]:
            return "Unrelated"

        return result
    except Exception as e:
        print(f"[!] Gemini classification failed for {name}: {e}")
        return "Unrelated"


def get_lat_lon(destination):
    """Uses Google Places Text Search to get lat/lon for a destination."""
    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        "query": destination,
        "key": GOOGLE_PLACES_API_KEY
    }
    res = requests.get(url, params=params).json()

    if res["status"] == "OK":
        location = res["results"][0]["geometry"]["location"]
        return location["lat"], location["lng"]
    else:
        raise ValueError(f"Could not fetch lat/lon for destination: {destination}")


def get_places_by_text_search(destination, theme=None, limit=20):
    query = f"tourist attractions in {destination}"
    if theme:
        query = f"{theme} activities in {destination}"  # AI can still filter later

    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        "query": query,
        "key": GOOGLE_PLACES_API_KEY
    }

    all_results = []
    while True:
        res = requests.get(url, params=params).json()
        all_results.extend(res.get("results", []))

        if "next_page_token" in res and len(all_results) < limit:
            time.sleep(2)
            params["pagetoken"] = res["next_page_token"]
        else:
            break

        if len(all_results) >= limit:
            break

    return all_results[:limit]


places = get_places_by_text_search("Ella", limit=20)

for place in places:
    theme = classify_place_theme(place)
    place["theme"] = theme
    print(f"[{theme}] {place["name"]}")

filtered_places = [place for place in places if filter_place(place)]
filtered_places = deduplicate_places(filtered_places)

for place in filtered_places:
    name = beautify_place_name_with_ai(place["name"], place["types"])
    place["name"] = name
    print(name)