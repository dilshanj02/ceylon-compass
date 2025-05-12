from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

from . import views

urlpatterns = [
    # path("", views.api_overview, name="api_overview"),
    path("register/", views.RegisterView.as_view(), name="register"),

    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("protected/", views.ProtectedView.as_view(), name="protected_view"),

    path("destinations/", views.destination_list, name="destination_list"),
    path("themes/", views.theme_list, name="theme_list"),
    path("suggest_places/", views.suggested_places, name="suggested_places"),
    path("trips/", views.trip_list, name="trip_list"),
    path("trips/<int:id>/", views.trip_detail, name="trip_detail"),
    path("trips/validate/", views.trip_validate, name="trip_validate"),
    
    
    path("plans/", views.plan_list, name="plan_list"),
    path("plans/<int:id>/", views.plan_detail, name="plan_detail"),
    path("plans/<int:id>/delete/", views.delete_trip_plan, name="delete_trip_plan"),

    path("reviews/", views.review_list, name="review_list"),

    path("emergency/", views.emergency_contacts, name="emergency_contacts"),
]
