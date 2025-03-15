from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Trip
from .serializers import TripSerializer

@api_view(['GET'])
def api_overview(request):
    api_endpoints = {
        'get token': 'api/token/',
        'refresh token': 'api/refresh',
        'list/create trip': 'api/trip',
    }

    return Response(api_endpoints)


@api_view(['GET', 'POST'])
def trip_list(request):
    """
    GET: Retrieve all trips.
    POST: Create a new trip.
    """
    if request.method == 'GET':
        trips = Trip.objects.all()
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        serializer = TripSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
