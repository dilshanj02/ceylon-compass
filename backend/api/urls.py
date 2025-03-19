from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

urlpatterns = [
    # path("", views.api_overview, name="api_overview"),
    path("register/", views.RegisterView.as_view(), name="register"),
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("trips/", views.trip_list, name="trip_list"),
    path("trips/<int:id>/", views.trip_detail, name="trip_detail"),
    path("trips/validate/", views.trip_validate, name="trip_validate"),
    path("plans/", views.plan_list, name="plan_list"),
    path("plans/<int:id>/", views.plan_detail, name="plan_detail"),
]
