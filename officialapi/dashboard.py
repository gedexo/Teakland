from itertools import count
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import generics
from rest_framework.settings import api_settings
from rest_framework import status
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from. models import jobcard, payments, quotation, users, expences
from django.db.models import Q
from django.db.models import Count
import datetime
from datetime import datetime, timedelta
from django.db.models import Sum


class DashboardData(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def get(self,request,format=None):
        lastMonth = datetime.today() - timedelta(days=30)
        quotations = quotation.objects.aggregate(
            lastmonth= Count('pk', filter=Q(date__gte=lastMonth)),
            open=Count('pk',filter=Q(status="open")),
            onprocess=Count('pk',filter=Q(status="onprocess")),
            pending=Count('pk',filter=Q(status='pending')),
            completed=Count('pk',filter=Q(status='completed')),
            delivered=Count('pk',filter=Q(status='delivered'))
            )
        quotationCount = quotation.objects.count()
        incomeLastMonth = payments.objects.filter(date__gte = lastMonth).aggregate(sum=Sum('amount'))
        expenceLastMonth = expences.objects.filter(date__gte = lastMonth).aggregate(sum=Sum('amount'))
        income = payments.objects.aggregate(sum=Sum('amount'))
        expence = expences.objects.aggregate(sum=Sum('amount'))

        data = {
            'quotation':quotationCount,
            'countstatus':quotations,
            'income':income,
            'expence':expence,
            'income_lastmonth':incomeLastMonth,
            'expence_lastmonth':expenceLastMonth
        }
        return Response(data,status.HTTP_200_OK)
    
class DashboardJobcardCount(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def get(self,request,format=None):
    
        branch = users.objects.all().select_related('jobcard__set').annotate(open=Count('pk',filter=Q(jobcard__status="open")),onprocess=Count('pk',filter=Q(jobcard__status="onprocess")),pending=Count('pk',filter=Q(jobcard__status="pending")),completed=Count('pk',filter=Q(jobcard__status="completed")),delivered=Count('pk',filter=Q(jobcard__status="delivered"))).values('id','name','open','onprocess','pending','completed','delivered')
        data = {
            'branch':branch,
        }
        print(branch)
        return Response(branch,status.HTTP_200_OK)
    
