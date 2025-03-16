from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Trip
from .serializers import TripSerializer

from .services import engine

@api_view(['GET'])
def api_overview(request):
    api_endpoints = {
        "get token": "api/token/",
        "refresh token": "api/refresh",
        "list/create trip": "api/trip",
    }

    return Response(api_endpoints)

@api_view(["POST"])
def trip_validate(request):
    serializer = TripSerializer(data=request.data)

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
        serializer = TripSerializer(data=request.data)

        if serializer.is_valid():
            trip = serializer.save()

            return Response({
                "message": "Trip created",
                "trip_id": trip.id,
                "trip_details": serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def trip_detail(request, id):
    try:
        trip = Trip.objects.get(id=id)

    except Trip.DoesNotExist:
        return Response({"error": "Trip not found"}, status=status.HTTP_404_NOT_FOUND)
    
    trip_data = TripSerializer(trip).data

    return Response(trip_data, status=status.HTTP_200_OK)


@api_view(["POST"])
def trip_plan(request, id):
    """
    Generate a trip plan
    """

    trip = get_object_or_404(Trip, id=id)

    try:
        plan = engine.generate_trip_plan(trip)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(plan, status=status.HTTP_200_OK)


