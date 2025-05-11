from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404, redirect
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponseRedirect

from .models import Trip, TripPlan, Review, EmergencyContact, Destination, Theme, Place
from .serializers import TripSerializer, TripPlanSerializer, RegisterSerializer, ReviewSerializer, EmergencyContactSerializer, DestinationSerializer, ThemeSerializer, PlaceSerializer

from .services import engine

# A protected view to test authentication
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "email": user.email
        })


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "User created"
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def destination_list(request):
    """
    GET: Retrieve all destinations.
    """ 
    destinations = Destination.objects.all().order_by("name")
    serializer = DestinationSerializer(destinations, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def theme_list(request):
    """
    GET: Retrieve all themes.
    """
    themes = Theme.objects.all().order_by("name")
    serializer = ThemeSerializer(themes, many=True)
    
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def suggested_places(request):
    """
    GET: Retrieve suggested places based on destination and theme.
    """
    dest_name = request.GET.get("destination")
    theme_name = request.GET.get("theme")

    destination = get_object_or_404(Destination, name__iexact=dest_name)
    theme = get_object_or_404(Theme, name__iexact=theme_name)

    places = Place.objects.filter(destination=destination, theme=theme)[:6]
    serializer = PlaceSerializer(places, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def trip_validate(request):
    serializer = TripSerializer(data=request.data, context={"request": request})

    if serializer.is_valid():
        return Response({
            "message": "Data is valid",
            "trip_details": serializer.data
        }, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "POST"])
def trip_list(request):
    """
    GET: Retrieve all trips.
    POST: Create a new trip.
    """
    if request.method == "GET":
        trips = Trip.objects.all()
        serializer = TripSerializer(trips, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == "POST":
        serializer = TripSerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            serializer.save()

            return Response({
                "message": "Trip created",
                "trip_details": serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def trip_detail(request, id):
    """
    GET: Retrieve trip details.
    """
    try:
        trip = Trip.objects.get(id=id)

    except Trip.DoesNotExist:
        return Response({"error": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)
    
    trip_data = TripSerializer(trip).data

    return Response(trip_data, status=status.HTTP_200_OK)


@api_view(["GET", "POST"])
def plan_list(request):
    """
    GET: Retrieve all plans.
    POST: Create a new plan.
    """
    if request.method == "GET":
        trips = TripPlan.objects.filter(trip__user=request.user).order_by("-id")
        serializer = TripPlanSerializer(trips, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == "POST":
        trip_id = request.data.get("trip_id")
        trip = get_object_or_404(Trip, id=trip_id)

        try:
            plan_data = engine.generate_trip_plan(trip)

            trip_plan, created = TripPlan.objects.get_or_create(
                trip = trip,
                defaults = {
                    "itinerary": plan_data["itinerary"],
                    "accommodation": plan_data["accommodation"],
                    "cost_breakdown": plan_data["cost_breakdown"]
                }
            )

            serializer = TripPlanSerializer(trip_plan)

            if created:
                message = "Trip plan created"
                status_code = status.HTTP_201_CREATED
            else:
                message = "Trip plan already exists"
                status_code = status.HTTP_200_OK

            return Response({
                "message": message,
                "trip_plan": serializer.data
            }, status=status_code)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

@api_view(["GET"])
def plan_detail(request, id):
    """
    GET: Retrieve plan details.
    """
    try:
        plan = TripPlan.objects.get(id=id)

    except TripPlan.DoesNotExist:
        return Response({"error": "Plan not found"}, status=status.HTTP_404_NOT_FOUND)
    
    plan_data = TripPlanSerializer(plan).data

    return Response(plan_data, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_trip_plan(request, id):
    try:
        trip_plan = TripPlan.objects.get(id=id, trip__user=request.user)
    except TripPlan.DoesNotExist:
        return Response({"error": "Trip not found."}, status=status.HTTP_404_NOT_FOUND)

    trip_plan.delete()
    return Response({"message": "Trip deleted."}, status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"]) 
def review_list(request):
    if request.method == 'GET':
        reviews = Review.objects.all().order_by("-created_at")
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ReviewSerializer(data=request.data, context={"request": request})
        if serializer.is_valid():
            serializer.save(user=request.user)  # 👈 Attach logged-in user
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["GET"])
def emergency_contacts(request):
    destination = request.query_params.get("destination")
    if destination:
        contacts = EmergencyContact.objects.filter(destination=destination)
    else:
        contacts = EmergencyContact.objects.all()

    serializer = EmergencyContactSerializer(contacts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)





# # Proxy view for Google Photos
@api_view(["GET"])
def proxy_google_photo(request):
    ref = request.GET.get("ref")
    if not ref:
        return redirect("/static/images/placeholder.jpg")
    return HttpResponseRedirect(
        f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={ref}&key=YOUR_API_KEY"
    )# 