# Generated by Django 5.1.7 on 2025-04-24 22:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_accommodation'),
    ]

    operations = [
        migrations.AddField(
            model_name='tripplan',
            name='accommodation',
            field=models.JSONField(default=''),
            preserve_default=False,
        ),
    ]
