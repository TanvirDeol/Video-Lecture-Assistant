from rest_framework import serializers
from .models import pyConnect

class pyConnectSerializer(serializers.ModelSerializer):
    class Meta:
        model = pyConnect
        fields = ('id','link','keywords','result')