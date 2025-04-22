from django.core.management.base import BaseCommand
from api.models import Theme

THEMES = [
    "Adventure & Outdoors",
    "Leisure & Relaxation",
    "Culture & Heritage",
]

class Command(BaseCommand):
    help = "Populates the Theme model with default travel themes."

    def handle(self, *args, **kwargs):
        for theme_name in THEMES:
            obj, created = Theme.objects.get_or_create(name=theme_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f"✅ Created theme: {theme_name}"))
            else:
                self.stdout.write(f"⏭️ Theme already exists: {theme_name}")
