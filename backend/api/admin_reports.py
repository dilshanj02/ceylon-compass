# api/admin_reports.py
from django.contrib import admin
from django.urls import path
from .views_admin import reports_dashboard, export_reports_csv

class CustomAdminSite(admin.AdminSite):
    site_header = "Ceylon Compass Administration"
    site_title = "Ceylon Compass Admin Portal"
    index_title = "Welcome to Ceylon Compass Admin"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('reports/', self.admin_view(reports_dashboard), name="reports_dashboard"),
            path('reports/export/', self.admin_view(export_reports_csv), name="export_report_csv"),
        ]
        return custom_urls + urls

# Instantiate our custom admin site
custom_admin_site = CustomAdminSite(name="custom_admin")
