from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.http import HttpResponse

@api_view(['GET'])
def api_overview(request):
    api_endpoints = {
        'get-token': 'api/token/',
        'refresh-token': 'api/refresh'
    }

    return Response(api_endpoints)

