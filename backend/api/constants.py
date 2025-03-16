DESTINATIONS = ["Colombo", "Kandy", "Galle", "Nuwara Eliya", "Ella", "Jaffna"]
THEMES = ["Adventure & Outdoors", "Leisure & Relaxation", "Culture & Heritage"]

TRANSPORT_COSTS = {
    "Public": 2000,
    "Private": 3500,
    "Rental": 4500
}

ACCOMMODATION_COSTS = {
    "Hotel": {
        "Luxury": 15000,
        "Mid-range": 10000,
        "Budget": 5000
    },
    "Villa": {
        "Luxury": 18000,
        "Mid-range": 12000,
        "Budget": 7000
    },
    "Guesthouse": {
        "Luxury": 8000,
        "Mid-range": 5000,
        "Budget": 3000
    },
    "Resort": {
        "Luxury": 20000,
        "Mid-range": 15000,
        "Budget": 9000
    }
}


ACTIVITIES_BY_DESTINATION_THEME = {
    "Colombo": {
        "Adventure & Outdoors": ["Cycling Tour", "Kayaking", "City Walks"],
        "Leisure & Relaxation": ["Beach Day", "Spa & Wellness", "Galle Face Green Visit"],
        "Culture & Heritage": ["National Museum Visit", "Gangaramaya Temple", "Colonial Architecture Tour"]
    },
    "Kandy": {
        "Adventure & Outdoors": ["Hiking", "Wildlife Safari", "Botanical Garden Tour"],
        "Leisure & Relaxation": ["Spa & Wellness", "Scenic Drive", "Tea Plantation Tour"],
        "Culture & Heritage": ["Temple of the Tooth", "Cultural Show", "Royal Palace Visit"]
    },
    "Galle": {
        "Adventure & Outdoors": ["Snorkeling", "Scuba Diving", "Hiking", "Cycling Tour"],
        "Leisure & Relaxation": ["Beach Day", "Fishing Tour", "Historical Walk"],
        "Culture & Heritage": ["Galle Fort Tour", "Museum Visit", "Dutch Reformed Church", "Old Town Walk"]
    },
    "Nuwara Eliya": {
        "Adventure & Outdoors": ["Horton Plains Hike", "World's End", "Waterfall Trek"],
        "Leisure & Relaxation": ["Lake Gregory Boat Ride", "Tea Plantation Tour", "Scenic Train Ride"],
        "Culture & Heritage": ["Victoria Park", "Colonial Architecture Tour", "Hakgala Botanical Gardens"]
    },
    "Ella": {
        "Adventure & Outdoors": ["Ella Rock Hike", "Nine Arches Bridge Walk", "Zip Lining", "Ravana Falls Trek"],
        "Leisure & Relaxation": ["Tea Plantation Tour", "Scenic Train Ride", "Nature Walk", "Relax at Ella's Viewpoints"],
        "Culture & Heritage": ["Temple Visit", "Local Market Visit", "Ella History Tour"]
    },
    "Jaffna": {
        "Adventure & Outdoors": ["Beach Day", "Snorkeling", "Boat Ride", "Cycling Tour"],
        "Leisure & Relaxation": ["Relaxing by the Beach", "Heritage Walk", "Nature Walk", "Cultural Event Participation"],
        "Culture & Heritage": ["Jaffna Fort Tour", "Nallur Kandaswamy Temple", "Jaffna Library", "Keerimalai Springs"]
    },
}

FOOD_COST_PER_DAY = 2500
MISC_COST_PERCENTAGE = 0.15