from itertools import count
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import generics
from rest_framework.settings import api_settings
from rest_framework import status
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from officialapi. models import jobcard, quotation, users,payments,expences
from django.db.models import Q
from django.db.models import Count
import datetime
from datetime import datetime, timedelta,date
from django.db.models.functions import TruncMonth
from django.db.models import Sum

class DashboardData(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self,request,format=None):
        print(self.request.user.user.name)
        todays_date = date.today()
        lastMonth = datetime.today() - timedelta(days=30)
        lastMonthQuotation = quotation.objects.filter(user=self.request.user.user,date__gte=lastMonth).count()
        monthData = quotation.objects.filter(user=self.request.user.user,date__year=todays_date.year).annotate(month=TruncMonth('date')).values('month').annotate(total=Count('pk'))
        quotationCount = quotation.objects.filter(user=self.request.user.user).count()
        incomeLastMonth = payments.objects.filter(quotation__user=self.request.user.user,date__gte = lastMonth).aggregate(sum=Sum('amount'))
        expenceLastMonth = expences.objects.filter(user=self.request.user.user,date__gte = lastMonth).aggregate(sum=Sum('amount'))
        income = payments.objects.filter(quotation__user=self.request.user.user).aggregate(sum=Sum('amount'))
        expence = expences.objects.filter(user=self.request.user.user).aggregate(sum=Sum('amount'))
        data = {
            'quotation':quotationCount,
            'lastmonth':lastMonthQuotation,
            'months-data':monthData,
            'income':income,
            'expence':expence,
            'income_lastmonth':incomeLastMonth,
            'expence_lastmonth':expenceLastMonth
        }
        return Response(data,status.HTTP_200_OK)
    
class JobcardCount(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self,request,format=None):
        
        jobcardCount  = jobcard.objects.aggregate(
            open=Count('pk',filter=Q(status="open",user=self.request.user.user)),
            onprocess=Count('pk',filter=Q(status="onprocess",user=self.request.user.user)),
            pending=Count('pk',filter=Q(status='pending',user=self.request.user.user)),
            completed=Count('pk',filter=Q(status='completed',user=self.request.user.user)),
            delivered=Count('pk',filter=Q(status='delivered',user=self.request.user.user))
            )
        return Response({'jobcard':jobcardCount},status.HTTP_200_OK)