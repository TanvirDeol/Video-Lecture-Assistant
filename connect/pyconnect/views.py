from django.shortcuts import render
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from .serializers import pyConnectSerializer
from .models import pyConnect
import fuzzy_model as fm

# Create your views here.

class pyConnectView(viewsets.ModelViewSet):
    serializer_class = pyConnectSerializer
    queryset = pyConnect.objects.all()

    def create(self,request):
        obj = request.data["params"]
        new_obj = pyConnect.objects.create(link=obj["link"],keywords=obj["keywords"],
        result=fm.search(obj['link'],obj['keywords']))
        serializer = pyConnectSerializer(new_obj)
        print(serializer.data)
        return Response(serializer.data)
