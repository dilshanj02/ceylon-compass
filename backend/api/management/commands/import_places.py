import json
from django.core.management.base import BaseCommand, CommandError
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

                if created:
                    created_count += 1
                    self.stdout.write(f"[+] Created: {place.beautified_name}")
                else:
                    updated_count += 1
                    self.stdout.write(f"[~] Updated: {place.beautified_name}")
            except Exception as e:
                self.stderr.write(f"[!] Failed to import place {data.get('name')} — {e}")
                continue

        self.stdout.write(self.style.SUCCESS(f"\nImport complete! {created_count} created, {updated_count} updated."))
