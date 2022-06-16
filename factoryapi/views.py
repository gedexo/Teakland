from contextlib import nullcontext
from pickle import NONE
import stat
from time import pthread_getcpuclockid
from traceback import print_tb
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import generics
from rest_framework.settings import api_settings
from rest_framework import status
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from officialapi. models import factory, jobcard, other_products_item,quotation, quotation_customkattla_item, quotation_door_item, quotation_kattla_item, quotation_window_item
from rest_framework.exceptions import ValidationError
from . permissions import FactoryPemission
from . serializer import ViewJobCardSerializer,DeliveredJobCardSerializer
from userapi . jobcard_helper import validatecash, recievedCash
from userapi . serializer import GetQuatation
from datetime import date
from django.db.models import Q
from django.db.models import Count
# Create your views here.

class CheckUser(APIView):
    permission_classes = [FactoryPemission]
    def get(self,request):
        if self.request.user.is_superuser == False and self.request.user.factory != None:
            return Response({}, status=status.HTTP_200_OK)
        
        elif self.request.user.is_superuser == True and self.request.user.factory != None:
            return Response({}, status=status.HTTP_200_OK)
        else:
            return Response({}, status=status.HTTP_401_UNAUTHORIZED)
        
class JobCards(viewsets.ModelViewSet):
    queryset = jobcard.objects.all()
    serialier_class = ViewJobCardSerializer
    permission_classes = [FactoryPemission]

    def get_queryset(self):
        jobcardNo = self.request.query_params.get('jobcard_number')
        status = self.request.query_params.get('status')
        is_delivered = self.request.query_params.get('is_delivered')
        statusChoices = ['delivered','completed']
        jobcardId = []
        jobcards = jobcard.objects.all().exclude(status='delivered')
        for i in jobcards:
            if quotation_door_item.objects.filter(factory=self.request.user.factory, quotation = i.quotation).exists():
                jobcardId.append(i.id)
            elif quotation_kattla_item.objects.filter(factory=self.request.user.factory, quotation = i.quotation).exists():
                jobcardId.append(i.id)
            elif quotation_window_item.objects.filter(factory=self.request.user.factory, quotation = i.quotation).exists():
                jobcardId.append(i.id)
            elif quotation_customkattla_item.objects.filter(factory=self.request.user.factory, quotation = i.quotation).exists():
                jobcardId.append(i.id)
            elif other_products_item.objects.filter(factory=self.request.user.factory, quotation = i.quotation).exists():
                jobcardId.append(i.id)
                
            else:
                pass    
        if jobcardNo != None:
            return self.queryset.filter(jobcardno=jobcardNo).exclude(status='delivered')
        elif status != None:
            return self.queryset.filter(id__in=jobcardId,status=status)
        elif is_delivered != None:
            return self.queryset.all()
        else:            
            return self.queryset.filter(id__in = jobcardId).order_by('is_seen').exclude(status__in=statusChoices)
        
    def perform_update(self, serializer):
        if serializer.is_valid():
            quotationNo = jobcard.objects.get(id=self.kwargs['pk'])
            quotatationId = quotationNo.quotation.id
            totalcount = []
            totalCountFactory = []
            status = ['open','pending','started']
            doors = quotation_door_item.objects.filter(quotation=quotatationId,status__in=status).count()
            window = quotation_window_item.objects.filter(quotation=quotatationId,status__in=status).count()
            kattla = quotation_kattla_item.objects.filter(quotation=quotatationId,status__in=status).count()
            customkattla = quotation_customkattla_item.objects.filter(quotation=quotatationId,status__in=status).count()
            others       = other_products_item.objects.filter(quotation=quotatationId,status__in=status).count()

            doorsF = quotation_door_item.objects.filter(factory=self.request.user.factory,quotation=quotatationId,status__in=status).count()
            windowF = quotation_window_item.objects.filter(factory=self.request.user.factory,quotation=quotatationId,status__in=status).count()
            kattlaF = quotation_kattla_item.objects.filter(factory=self.request.user.factory,quotation=quotatationId,status__in=status).count()
            customkattlaF = quotation_customkattla_item.objects.filter(factory=self.request.user.factory,quotation=quotatationId,status__in=status).count()
            othersF       = other_products_item.objects.filter(factory=self.request.user.factory,quotation=quotatationId,status__in=status).count()
            totalcount.append((doors,window,kattla,customkattla,others))
            totalCountFactory.append((doorsF,windowF,kattlaF,customkattlaF,othersF))
            sumTotalCount = sum(list(map(sum, list(totalcount))))
            sumFactoryCount = sum(list(map(sum, list(totalCountFactory))))
            print('total:',sumTotalCount)
            print('factorycount:',sumFactoryCount)
            if self.request.POST['status'] == 'completed':
                if sumFactoryCount != 0:
                    res = ValidationError({'message':'please update all quotation status'})
                    res.status_code = 208
                    raise res
                elif sumFactoryCount == 0 and sumTotalCount == 0:
                    updateQuotationStatus= quotation.objects.get(id=quotatationId)
                    updateQuotationStatus.status = self.request.POST['status']
                    updateQuotationStatus.save()
                    return super().perform_update(serializer)
                elif sumFactoryCount == 0 and sumTotalCount !=0:
                    updateQuotationStatus= quotation.objects.get(id=quotatationId)
                    updateQuotationStatus.status = 'partiallycompleted'
                    updateQuotationStatus.save()
                    updateQuotationStatus= jobcard.objects.get(id=self.kwargs['pk'])
                    updateQuotationStatus.status = 'partiallycompleted'
                    updateQuotationStatus.save()
                    res = ValidationError({'message':'completed'})
                    res.status_code = 200
                    raise res
                    
            elif self.request.POST['status'] == 'delivered':
                totalBillAMt = validatecash(quotatationId)
                recievedAmt = recievedCash(quotatationId)

                if int(totalBillAMt) == int(recievedAmt) and sumTotalCount == 0:
                    updateQuotationStatus= quotation.objects.get(id=quotatationId)
                    updateQuotationStatus.status = self.request.POST['status']
                    updateQuotationStatus.save()
                    serializer.save(delivered_user=self.request.user,completed_date=date.today())
                else:
                    if (int(totalBillAMt) != int(recievedAmt)):
                        res = ValidationError({'message':'Bill balance is due'})
                        res.status_code = 406
                        raise res
                    elif sumTotalCount != 0:
                        res = ValidationError({'message':'please update all quotation status'})
                        res.status_code = 208
                        raise res
                        
            else:
                updateQuotationStatus= quotation.objects.get(id=quotatationId)
                updateQuotationStatus.status = self.request.POST['status']
                updateQuotationStatus.save()
                return super().perform_update(serializer)  
    
    def get_serializer_class(self):
        return ViewJobCardSerializer
 
class DeliveredJobCards(viewsets.ModelViewSet):
    queryset = jobcard.objects.all()
    serialier_class = DeliveredJobCardSerializer
    permission_classes = [FactoryPemission] 
    
    def get_queryset(self):
        jobcardId = []
        status = ['completed','delivered']
        factory = self.request.query_params.get('factory')
        if factory != None:
            
            jobcards = jobcard.objects.all()
            for i in jobcards:
                if quotation_door_item.objects.filter(factory=self.request.user.factory, quotation = i.quotation).exists():
                    jobcardId.append(i.id)
                elif quotation_kattla_item.objects.filter(factory=self.request.user.factory, quotation = i.quotation).exists():
                    jobcardId.append(i.id)
                elif quotation_window_item.objects.filter(factory=self.request.user.factory, quotation = i.quotation).exists():
                    jobcardId.append(i.id)
                elif quotation_customkattla_item.objects.filter(factory=self.request.user.factory, quotation = i.quotation).exists():
                    jobcardId.append(i.id)
                elif other_products_item.objects.filter(factory=self.request.user.factory, quotation = i.quotation).exists():
                    jobcardId.append(i.id)
                    
                else:
                    pass                    
            return self.queryset.filter(id__in = jobcardId,status__in=status)
        
        else:
            return self.queryset.filter(user=self.request.user.user,status='delivered')

    http_method_names = ['get','list','retrieve']

    def get_serializer_class(self):
        return DeliveredJobCardSerializer
    
class Quotations(viewsets.ModelViewSet):
    queryset = quotation.objects.all()
    serializer_class = GetQuatation
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get','list','retrieve']
        
class CountObjects(APIView):
    permission_classes = [FactoryPemission]
    def get(self,request,format=None):
        jobcardId = []
        jobcards = jobcard.objects.all().exclude(status='delivered')
        for i in jobcards:
            if quotation_door_item.objects.filter(factory=self.request.user.factory, quotation = i.quotation).exists():
                jobcardId.append(i.id)
            elif quotation_kattla_item.objects.filter(factory=self.request.user.factory, quotation = i.quotation).exists():
                jobcardId.append(i.id)
            elif quotation_window_item.objects.filter(factory=self.request.user.factory, quotation = i.quotation).exists():
                jobcardId.append(i.id)
            elif quotation_customkattla_item.objects.filter(factory=self.request.user.factory, quotation = i.quotation).exists():
                jobcardId.append(i.id)
            elif other_products_item.objects.filter(factory=self.request.user.factory, quotation = i.quotation).exists():
                jobcardId.append(i.id)
        jobcardCount = jobcard.objects.filter(is_seen= False,id__in=jobcardId).count()
        jobcardStatusCount  = jobcard.objects.aggregate(
            open=Count('pk',filter=Q(status="open",id__in=jobcardId)),
            onprocess=Count('pk',filter=Q(status="onprocess",id__in=jobcardId)),
            pending=Count('pk',filter=Q(status='pending',id__in=jobcardId)),
            completed=Count('pk',filter=Q(status='completed',id__in=jobcardId)),
            delivered=Count('pk',filter=Q(status='delivered',id__in=jobcardId))
            )
        return Response({'jobcard':jobcardCount,'jobcard_status':jobcardStatusCount})
    
    
class CheckJobCard(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self,request,pk,format=None):
        jobcardId = []
        jobcardCheck = jobcard.objects.get(id=pk)
        
        if quotation_door_item.objects.filter(factory=self.request.user.factory, quotation = jobcardCheck.quotation).exists():
            jobcardId.append(True)
        elif quotation_kattla_item.objects.filter(factory=self.request.user.factory, quotation = jobcardCheck.quotation).exists():
            jobcardId.append(True)
        elif quotation_window_item.objects.filter(factory=self.request.user.factory, quotation = jobcardCheck.quotation).exists():
            jobcardId.append(True)
        elif quotation_customkattla_item.objects.filter(factory=self.request.user.factory, quotation = jobcardCheck.quotation).exists():
            jobcardId.append(True)
        elif other_products_item.objects.filter(factory=self.request.user.factory, quotation = jobcardCheck.quotation).exists():
            jobcardId.append(True)
            
        return JsonResponse({'data':jobcardId[0]})