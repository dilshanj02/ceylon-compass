from api.admin_reports import custom_admin_site
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from api.views_admin import export_reports_csv

urlpatterns = [
    path('admin/', custom_admin_site.urls),
    path('api/', include('api.urls')),
]



# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)