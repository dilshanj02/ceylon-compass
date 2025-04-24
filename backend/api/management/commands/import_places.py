import json
import requests
from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify
from django.core.files.base import ContentFile
from django.conf import settings
from api.models import Place, Destination, Theme


class Command(BaseCommand):
    help = "Import enriched places from a JSON file and link to a destination"

    def add_arguments(self, parser):
        parser.add_argument("json_file", type=str, help="Path to the JSON file")
        parser.add_argument("destination_name", type=str, help="Destination name (must already exist)")

    def handle(self, *args, **options):
        json_file = options["json_file"]
        destination_name = options["destination_name"]

        try:
            destination = Destination.objects.get(name__iexact=destination_name)
        except Destination.DoesNotExist:
            raise CommandError(f"Destination '{destination_name}' does not exist.")

        with open(json_file, "r", encoding="utf-8") as f:
            places = json.load(f)

        created_count = 0
        updated_count = 0

        for data in places:
            theme_obj, _ = Theme.objects.get_or_create(name=data["theme"])

            try:
                place, created = Place.objects.update_or_create(
                    google_place_id=data["google_place_id"],
                    defaults={
                        "destination": destination,
                        "theme": theme_obj,
                        "name": data["name"],
                        "beautified_name": data["beautified_name"],
                        "description": data["description"],
                        "lat": data["lat"],
                        "lng": data["lng"],
                        "rating": data.get("rating"),
                        "num_reviews": data.get("num_reviews", 0),
                        "types": data.get("types", []),
                        "photo_reference": data.get("photo_reference", ""),
                    },
                )

                # If photo_reference is available and no image saved yet, try to fetch and save image
                if data.get("photo_reference") and not place.image:
                    result = self.download_google_place_image(data["photo_reference"], data["name"])
                    if result:
                        filename, content = result
                        place.image.save(filename, ContentFile(content), save=True)

                if created:
                    created_count += 1
                    self.stdout.write(f"[+] Created: {place.beautified_name}")
                else:
                    updated_count += 1
                    self.stdout.write(f"[~] Updated: {place.beautified_name}")
            except Exception as e:
                self.stderr.write(f"[!] Failed to import place {data.get('name')} — {e}")
                continue

        self.stdout.write(self.style.SUCCESS(f"\n✅ Import complete! {created_count} created, {updated_count} updated."))

    def download_google_place_image(self, photo_reference, place_name, maxwidth=800):
        if not photo_reference:
            return None

        base_url = "https://maps.googleapis.com/maps/api/place/photo"
        params = {
            "maxwidth": maxwidth,
            "photoreference": photo_reference,
            "key": settings.GOOGLE_PLACES_API_KEY,
        }

        try:
            # Step 1: get redirect URL
            r = requests.get(base_url, params=params, allow_redirects=False, timeout=10)
            if r.status_code != 302:
                return None

            image_url = r.headers.get("Location")
            if not image_url:
                return None

            # Step 2: fetch image bytes
            image_response = requests.get(image_url, timeout=10)
            if image_response.status_code != 200:
                return None

            filename = f"{slugify(place_name)}.jpg"
            return filename, image_response.content

        except requests.RequestException as e:
            self.stderr.write(f"Image fetch error for {place_name}: {e}")
            return None
