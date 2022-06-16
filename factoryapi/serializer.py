from rest_framework import serializers
from rest_framework.response import Response
from django.contrib.auth import get_user_model,authenticate
from rest_framework import status
from officialapi.models import jobcard
from django.db.models import Sum
from versatileimagefield.serializers import VersatileImageFieldSerializer
from userapi. serializer import quotationSerializer,CustUserSerializer,UserSerializer

class ViewJobCardSerializer(serializers.ModelSerializer):
    created_date = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    quotation = quotationSerializer(read_only=True)
    created_user = CustUserSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    class Meta:
        model = jobcard
        fields = '__all__'
        read_only_fileds = ('created_user','delivered_user',)
        
class DeliveredJobCardSerializer(serializers.ModelSerializer):
    created_date = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    quotation = quotationSerializer(read_only=True)
    created_user = CustUserSerializer(read_only=True)
    delivered_user = CustUserSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    class Meta:
        model = jobcard
        fields = '__all__'


