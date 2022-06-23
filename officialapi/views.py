from cgitb import reset
from nis import cat
import re
from sqlite3 import apilevel
from traceback import print_tb
from django import views
import json
from django.shortcuts import render
from . serializer import AdminUser,CreateUserSerailizer
from rest_framework.authentication import TokenAuthentication,SessionAuthentication
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import generics
from rest_framework.settings import api_settings
from rest_framework import status
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from . serializer import UserSerializer,DoorSerializer,CustUserSerializer,GetDoorsSerializer,WindowSerializer,GetWindowSerializer,KattlaSerializer,GetKattlaSerializer,\
    JointTypeSerializer,RowMaterialSerializer,CustomerSerializer,ViewQoutationSerializer,DoorQoutationSerializer,WindowQoutationSerializer,KattlaQoutationSerializer,\
        CustomKattlaSerializer,GetCustomKattlaSerializer,GetQuatationCustomKattlaSerializer,GalleryDoorSerializer,GalleryKattlaSerializer,GalleryWindowSerializer,\
            GalleryCustomKattlaSerializer,FactorySerializer,BankSerializer,CreateFactorySerailizer,CreateQuotationSerializer,FilterQoutationSerializer,UpdateJobCardSerializer,AdminUser,\
                OtherProductSerializer,GetOtherProductSerializer,ExpenceCategorySerializer,PaymentSerializer
from . models import expences, payments, users,window,kattla,door,row_materials,joint_type,customer,quotation,quotation_door_item,quotation_window_item,quotation_kattla_item,custom_kattla,\
    quotation_customkattla_item,feedback,factory,bank,jobcard,invoice,qoutation_feedback,others,other_products_item,expence_category,payments,salesman
from userapi .serializer import InvoiceSerializer, ViewJobCardSerializer,ViewInvoiceSerializer
from django.contrib.auth import get_user_model,authenticate
from rest_framework.exceptions import ValidationError
from .permissions import ProductGalleryPermission,FactoryPermission,BankPermission,BasicUserPermission,OthersProductPermission
from django.db.models import Count
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timedelta
from userapi. jobcard_helper import validatecash, recievedCash
from django.db.models import Sum
from django.contrib.auth.hashers import check_password

# Create your views here.

class CreateAdminUserView(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    """Create a new user in the system"""
    serializer_class = AdminUser

class CreateUserCredentials(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    """Create a new user in the system"""
    serializer_class = CreateUserSerailizer

class CreateOfficialUser(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    """Create a new user in the system"""
    serializer_class = AdminUser
    
class GetUsersLoginDetails(viewsets.ModelViewSet):
    serializer_classes = CustUserSerializer
    queryset = get_user_model().objects.all()
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_queryset(self):
        user = self.request.query_params.get('user_id')
        isAdmin = self.request.query_params.get('is_admin')
        if user != None:
            return self.queryset.filter(user = user)
        elif isAdmin != None:
            return self.queryset.filter(is_superuser=True)
        else:
            return self.queryset.all()
        
    def get_serializer_class(self):
        if self.action == 'list':
            return CustUserSerializer
        return CustUserSerializer                   
    
                      

class GetFactoryLoginDetails(viewsets.ModelViewSet):
    serializer_classes = CustUserSerializer
    queryset = get_user_model().objects.all()
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_queryset(self):
        factory = self.request.query_params.get('factory_id')
        if factory != None:
            return self.queryset.filter(factory = factory)
        else:
            return self.queryset.all()
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateFactorySerailizer
        return CustUserSerializer     


class CheckUser(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def get(self,request):
        if self.request.user.is_superuser == True:
            return Response({}, status=status.HTTP_200_OK)
        else:
            return Response({}, status=status.HTTP_401_UNAUTHORIZED)

class UserView(viewsets.ModelViewSet):
    serializer_classes = UserSerializer
    queryset = users.objects.all()
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def create(self,request,*args, **kwargs):
        email = self.request.POST['email']
        if users.objects.filter(email=email).exists():
            return Response({},status.HTTP_208_ALREADY_REPORTED) 
        else:
            return super().create(request, *args, **kwargs)
    
    def update(self, request, *args, **kwargs):
        email = self.request.POST['email']
        if users.objects.filter(email=email).exclude(id=self.kwargs['pk']).exists():
            return Response({},status.HTTP_208_ALREADY_REPORTED) 
        else:
            return super().update(request, *args, **kwargs)
    
    def get_serializer_class(self):
        return UserSerializer
    
    
class RowMaterials(viewsets.ModelViewSet):
    '''Endpoint to create and list rowmaterials'''
    queryset = row_materials.objects.all()
    serializer_class = RowMaterialSerializer
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_queryset(self):
        return self.queryset.all()
    
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            if self.queryset.filter(name = self.request.POST['name']).exists():
                return Response(
                    {'msg':'Rowmaterial is already exists'},
                    status=status.HTTP_208_ALREADY_REPORTED
                    )
            else:
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                    )
    
    def update(self, request, *args, **kwargs):       
        if self.queryset.filter(name = self.request.POST['name']).exclude(id=self.kwargs['pk']).exists():
            return Response(
                {'msg':'Rowmaterial is already exists'},
                status=status.HTTP_208_ALREADY_REPORTED
                )
        else:
            return super().update(request, *args, **kwargs)
        
    
    
    def get_serializer_class(self):
       return RowMaterialSerializer
   
class JointType(viewsets.ModelViewSet):
    '''Endpoint to create and list rowmaterials'''
    queryset = joint_type.objects.all()
    serializer_class = JointTypeSerializer
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_queryset(self):
        return self.queryset.all()
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            if self.queryset.filter(joint_type = self.request.POST['joint_type'],code = self.request.POST['code']).exists():
                return Response(
                    {'msg':'Jointtype is already exists'},
                    status=status.HTTP_208_ALREADY_REPORTED
                    )
            else:
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                    )
    
    def update(self, request, *args, **kwargs):       
        if self.queryset.filter(joint_type = self.request.POST['joint_type'],code = self.request.POST['code']).exclude(id=self.kwargs['pk']).exists():
            return Response(
                {'msg':'Jointtype is already exists'},
                status=status.HTTP_208_ALREADY_REPORTED
                )
        else:
            return super().update(request, *args, **kwargs)
    
    def get_serializer_class(self):
       return JointTypeSerializer       
        
class Doors(viewsets.ModelViewSet):
    '''Endpoint to create and list doors products'''
    queryset = door.objects.all()
    serializer_class = DoorSerializer
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_queryset(self):
        return self.queryset.all().order_by('rowmaterial')
    
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            if self.queryset.filter(rowmaterial = self.request.POST['rowmaterial'],doortype = self.request.POST['doortype'],joint = self.request.POST['joint']).exists():
                return Response(
                    {'msg':'Jointtype is already exists'},
                    status=status.HTTP_208_ALREADY_REPORTED
                    )
            else:
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                    )
       
    def update(self, request, *args, **kwargs):       
        if self.queryset.filter(rowmaterial = self.request.POST['rowmaterial'],doortype = self.request.POST['doortype'],joint = self.request.POST['joint']).exclude(id=self.kwargs['pk']).exists():
            return Response(
                {'msg':'Jointtype is already exists'},
                status=status.HTTP_208_ALREADY_REPORTED
                )
        else:
            return super().update(request, *args, **kwargs)         

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return GetDoorsSerializer
        return DoorSerializer


class Window(viewsets.ModelViewSet):
    '''Endpoint to create and list doors products'''
    queryset = window.objects.all()
    serializer_class = WindowSerializer
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_queryset(self):
        return self.queryset.all().order_by('rowmaterial')
    
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            if self.queryset.filter(rowmaterial = self.request.POST['rowmaterial'],box = self.request.POST['box'],shutter = self.request.POST['shutter'],labour_charge = self.request.POST['labour_charge'],design = self.request.POST['design']).exists():
                return Response(
                    {'msg':'Jointtype is already exists'},
                    status=status.HTTP_208_ALREADY_REPORTED
                    )
            else:
                return Response(
                    serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                    )
       
    def update(self, request, *args, **kwargs):       
        if self.queryset.filter(rowmaterial = self.request.POST['rowmaterial'],box = self.request.POST['box'],shutter = self.request.POST['shutter'],labour_charge = self.request.POST['labour_charge'],design = self.request.POST['design']).exclude(id=self.kwargs['pk']).exists():
            return Response(
                {'msg':'Jointtype is already exists'},
                status=status.HTTP_208_ALREADY_REPORTED
                )
        else:
            return super().update(request, *args, **kwargs)         
  
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return GetWindowSerializer
        return WindowSerializer
    
class Kattla(viewsets.ModelViewSet):
    queryset = kattla.objects.all()
    serialier_class = KattlaSerializer
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_queryset(self):
        return self.queryset.all().order_by('rowmaterial')
    
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return GetKattlaSerializer
        return KattlaSerializer 
    
class OthersProducts(viewsets.ModelViewSet):
    queryset = others.objects.all()
    serialier_class = OtherProductSerializer
    permission_classes = [OthersProductPermission,]
    
    def get_queryset(self):
        rowMaterial = self.request.query_params.get('row_material')
        if rowMaterial != None:
            return self.queryset.filter(rowmaterial=rowMaterial)
        return self.queryset.all().order_by('rowmaterial')
    
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return GetOtherProductSerializer
        return OtherProductSerializer 
    
class CustomKattla(viewsets.ModelViewSet):
    queryset = custom_kattla.objects.all()
    serialier_class = CustomKattlaSerializer
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_queryset(self):
        return self.queryset.all().order_by('rowmaterial')
    
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return GetCustomKattlaSerializer
        return CustomKattlaSerializer 
    
class ViewCustomer(viewsets.ModelViewSet):
    queryset = customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_queryset(self):
        a = []
        type = self.request.query_params.get('type')
        is_enquiry = self.request.query_params.get('is_enquiry')
        if is_enquiry == '':
            a.append('True','False')
        elif is_enquiry == 'True':  
            a = []
            a.append('True')
        elif is_enquiry == 'False':
            a = []
            a.append('False')
        if type != None or is_enquiry != None:
            return self.queryset.filter(Q(type=type) | Q(is_enquiry__in=a))
        return self.queryset.all()
    http_method_names = ['get', 'list',]
    
class Quotations(viewsets.ModelViewSet):
    queryset = quotation.objects.all()
    serializer_class = ViewQoutationSerializer
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_queryset(self):
        quotation = self.request.query_params.get('quotation_number')
        branch =  self.request.query_params.get('branch')
        status = self.request.query_params.get('status')
        if quotation != None:
            if self.queryset.filter(quoation_number=quotation).exists():
                return self.queryset.filter(quoation_number=quotation)
            else:
                res = ValidationError({'message':'There is no qoutaion in this qoutationnumber'})
                res.status_code = 400
                raise res
        elif status != None:
            return self.queryset.filter(status = status)
        elif branch != None:
            return self.queryset.filter(user=branch)
        else:
            return self.queryset.order_by('-id')

  
            
    def get_serializer_class(self):
        if self.action == 'create':
            return CreateQuotationSerializer
        return ViewQoutationSerializer

class UserPermission(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def put(self, request, format=None):
        print(request.POST)
        user = get_user_model()
        changeStatus = user.objects.get(id = self.request.POST['id'])
        changeStatus.is_active = self.request.POST['status']
        changeStatus.is_branchhead = self.request.POST['is_branchhead']
        changeStatus.save()
        return Response({},status.HTTP_200_OK)
    
class CreateQuotationForDoor(viewsets.ModelViewSet):
    queryset = quotation_door_item.objects.all()
    serializer_class = DoorQoutationSerializer
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_queryset(self):
        quotationNo = self.request.query_params.get('quotation_no')
        if quotationNo != None:
            return self.queryset.filter(quotation = quotationNo )
        else:
            return self.queryset.all()
        
    def get_serializer_class(self):
        return DoorQoutationSerializer
    
class CreateQuotationForKattla(viewsets.ModelViewSet):
    queryset = quotation_kattla_item.objects.all()
    serializer_class = KattlaQoutationSerializer
    permission_classes = (IsAuthenticated,IsAdminUser)
    def get_queryset(self):
        quotationNo = self.request.query_params.get('quotation_no')
        if quotationNo != None:
            return self.queryset.filter(quotation = quotationNo )
        else:
            return self.queryset.all()
        
    def get_serializer_class(self):
        return KattlaQoutationSerializer

class CreateQuotationForWindow(viewsets.ModelViewSet):
    queryset = quotation_window_item.objects.all()
    serializer_class = WindowQoutationSerializer
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_queryset(self):
        quotationNo = self.request.query_params.get('quotation_no')
        if quotationNo != None:
            return self.queryset.filter(quotation = quotationNo )
        else:
            return self.queryset.all()
        
    def get_serializer_class(self):     
        return WindowQoutationSerializer
    
   
class CreateQuotationForCustomKattla(viewsets.ModelViewSet):
    queryset = quotation_customkattla_item.objects.all()
    serializer_class = GetQuatationCustomKattlaSerializer
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_queryset(self):
        quotationNo = self.request.query_params.get('quotation_no')
        if quotationNo != None:
            return self.queryset.filter(quotation = quotationNo )
        else:
            return self.queryset.all()
        
    def get_serializer_class(self):     
        return GetQuatationCustomKattlaSerializer
    
class DoorGallery(viewsets.ModelViewSet):
    queryset = door.objects.all()
    serializer_class = GalleryDoorSerializer
    permission_classes = [ProductGalleryPermission]
    
    http_method_names = ['get','list','retrieve'] 
    
class KattlaGallery(viewsets.ModelViewSet):
    queryset = kattla.objects.all()
    serializer_class = GalleryKattlaSerializer
    permission_classes = [ProductGalleryPermission]
    
    http_method_names = ['get','list','retrieve'] 
    
class WindowGallery(viewsets.ModelViewSet):
    queryset = window.objects.all()
    serializer_class = GalleryWindowSerializer
    permission_classes = [ProductGalleryPermission]
    
    http_method_names = ['get','list','retrieve'] 
    
class CustomKattlaGallery(viewsets.ModelViewSet):
    queryset = custom_kattla.objects.all()
    serializer_class = GalleryCustomKattlaSerializer
    permission_classes = [ProductGalleryPermission]
    
    http_method_names = ['get','list','retrieve'] 
    
class ExpenceCategory(viewsets.ModelViewSet):
    queryset = expence_category.objects.all()
    serializer_class = ExpenceCategorySerializer
    permission_classes = (IsAuthenticated,)

class ViewProductGallery(APIView):
    
    def get(self,request,pk,category,format=None):
        if category == 'door':
            obj = door.objects.get(id=pk)
            data = GetDoorsSerializer(obj)
            return Response(data.data)
        
        elif category == 'window':
            obj = window.objects.get(id=pk)
            data = GetWindowSerializer(obj)
            return Response(data.data)
            
        elif category == 'kattla':
            obj = kattla.objects.get(id=pk)
            data = GetKattlaSerializer(obj)
            return Response(data.data)

        elif category == 'custom-product':
            obj = custom_kattla.objects.get(id=pk)
            data = GetCustomKattlaSerializer(obj)
            return Response(data.data)

class Factory(viewsets.ModelViewSet):
    queryset = factory.objects.all()
    serializer_class = FactorySerializer
    permission_classes = [FactoryPermission]
            
class Banks(viewsets.ModelViewSet):
    queryset = bank.objects.all()
    serializer_class = BankSerializer
    permission_classes = [BankPermission]

class CountObjects(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def get(self,request,format=None):
        feedbackCount = feedback.objects.filter(is_seen= False).count()
        quotationDeleteRequests = qoutation_feedback.objects.filter(is_seen= False).count()
        quotationsCount  = quotation.objects.filter(is_seen = False).count()
        jobcardCount  = jobcard.objects.aggregate(
            open=Count('pk',filter=Q(status="open")),
            onprocess=Count('pk',filter=Q(status="onprocess")),
            pending=Count('pk',filter=Q(status='pending')),
            completed=Count('pk',filter=Q(status='completed')),
            delivered=Count('pk',filter=Q(status='delivered'))
            )

        return Response({'feedback':feedbackCount,'quotation-delete-requests':quotationDeleteRequests,'jobcard':jobcardCount,'quotations':quotationsCount})

class JobCards(viewsets.ModelViewSet):
    queryset = jobcard.objects.all()
    serialier_class = ViewJobCardSerializer
    permission_classes = (IsAuthenticated,IsAdminUser)

    def get_queryset(self):
        factory = self.request.query_params.get('factory')
        if factory != None:
            jobcardId = []
            jobcards = jobcard.objects.all().exclude(status='delivered')
            for i in jobcards:
                if quotation_door_item.objects.filter(factory__id=factory, quotation = i.quotation).exists():
                    jobcardId.append(i.id)
                elif quotation_kattla_item.objects.filter(factory__id=factory, quotation = i.quotation).exists():
                    jobcardId.append(i.id)
                elif quotation_window_item.objects.filter(factory__id=factory, quotation = i.quotation).exists():
                    jobcardId.append(i.id)
                elif quotation_customkattla_item.objects.filter(factory__id=factory, quotation = i.quotation).exists():
                    jobcardId.append(i.id)
                elif other_products_item.objects.filter(factory__id=factory, quotation = i.quotation).exists():
                    jobcardId.append(i.id)
            return self.queryset.filter(id__in = jobcardId)
        return self.queryset.all().exclude(status='delivered')
        
    def get_serializer_class(self):
        if self.action == 'partial_update':
            return UpdateJobCardSerializer
        return ViewJobCardSerializer

class Invoices(viewsets.ModelViewSet):
    queryset = invoice.objects.all()
    serialier_class = ViewInvoiceSerializer
    permission_classes = (IsAuthenticated,IsAdminUser)

    def get_queryset(self):
        invoiceNo = self.request.query_params.get('invoice_number')
        quotationNo = self.request.query_params.get('quotation_number')
        if invoiceNo != None and quotationNo != None:
            if self.queryset.filter(invoiceno=invoiceNo,quotation=quotationNo).exists():
                return self.queryset.filter(invoiceno=invoiceNo)
        return self.queryset.all()
    def get_serializer_class(self):
        return ViewInvoiceSerializer
    
class GetUser(APIView):
    permission_classes = [BasicUserPermission,]
    def get(self,request,format=None):
        branchName = ''
        if self.request.user.is_superuser == False and self.request.user.user != None:
            branchName = self.request.user.user.name
        elif self.request.user.is_superuser == True and self.request.user.user != None:
            branchName = self.request.user.user.name
        elif self.request.user.factory != None and self.request.user.is_superuser == True:
            branchName = self.request.user.factory.place
        elif self.request.user.factory != None:
            branchName = self.request.user.factory.place
        user = request.user.email
        userSplit = user.split('@')
        data = userSplit[0]
        adminUser = self.request.user.is_superuser
        isBranchhead = self.request.user.is_branchhead
        return Response({'user':data,'email':user,'branch':branchName,'is_admin':adminUser,'is_branchhead':isBranchhead})

class Logout(APIView):
    permission_classes = [BasicUserPermission,]
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class CustomerCounts(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def get(self,request,format=None):
        
        quotationTotal = []
        lastMonthQuotationTotal = []
        recievedPaymentsPercentage = 0
        lastMonthsTotalPaymentsPercentage = 0
        pendingPaymentsPercentage = 0
        totalRecievedPayments  = 0
        lastMonths = datetime.today() - timedelta(days=30)
        lastMonthDate = lastMonths.strftime('%Y-%m-%d')
        totalCount = customer.objects.count()
        lastMonth  = customer.objects.filter(date__gte=lastMonthDate).count()
        lastMonthCustomerPercentage = lastMonth/totalCount*100
        quotations = invoice.objects.select_related('quotation').values('quotation__id')
        lastMontQuotations = quotation.objects.filter(date__gte = lastMonths).select_related('jobcard__set').values('id')
        recievedPayments = payments.objects.aggregate(sum=Sum('amount'))['sum'] or 0
        for i in quotations:
            quotationAmount = validatecash(i['quotation__id'])
            quotationTotal.append(quotationAmount)
            
        for j in lastMontQuotations:
            quotationAmount = validatecash(j['id'])
            lastMonthQuotationTotal.append(quotationAmount)
        try:
            recievedPaymentsPercentage = recievedPayments/sum(quotationTotal)*100
            lastMonthsTotalPaymentsPercentage = sum(lastMonthQuotationTotal)/sum(quotationTotal)*100
            pendingPaymentsPercentage = (sum(quotationTotal) - recievedPayments)/sum(quotationTotal)*100
        except:
            pass
        pendingAmount = sum(quotationTotal) - recievedPayments
        Customer = users.objects.all().select_related('customer__set').annotate(customersEnquiry=Count('pk',filter=Q(customer__is_enquiry=True)),customers=Count('pk',filter=Q(customer__is_enquiry=False))).values('name','customersEnquiry','customers')
        data = {
            'total_customer':totalCount,
            'last_month_customer_percentage':lastMonthCustomerPercentage,
            'total_payments':sum(quotationTotal),
            'last_month_payments_percentage':lastMonthsTotalPaymentsPercentage,
            'recieved_payments':recievedPayments,
            'recieved_payments_percentage':recievedPaymentsPercentage,
            'pending_amount':pendingAmount,
            'pending_payments_percentage':pendingPaymentsPercentage,
            'branch_based_customer':Customer,

        }
        return Response(data)
        
class FilterCustomersData(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def get(self,request,pk,format=None):
        quotations = quotation.objects.filter(customer=pk)
        obj = FilterQoutationSerializer(quotations,many=True)
        return Response(obj.data,status.HTTP_200_OK)        
    
class Income(viewsets.ModelViewSet):
    queryset = payments.objects.all()
    serialier_class = PaymentSerializer
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get_queryset(self):
        startDate = self.request.query_params.get('startdate')
        endDate = self.request.query_params.get('enddate')
        branch = self.request.query_params.get('branch')
        if startDate != None:
            branches = json.loads(branch)
            return self.queryset.filter(date__gte=startDate,date__lte=endDate,quotation__user__in=branches)
        return self.queryset.all()
    def get_serializer_class(self):
        return PaymentSerializer

# new changes

class UpdateUser(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def get(self,request,pk,category,format=None):
        updateUser = get_user_model().objects.get(id=self.request.user.id)
        if category == 'branch':
            branch = users.objects.get(id=pk)
            updateUser.user = branch
            updateUser.factory = None
            updateUser.save()
        elif category == 'factory':
            factoryObj = factory.objects.get(id=pk)
            updateUser.factory = factoryObj
            updateUser.user = None
            updateUser.save()
        return Response(status.HTTP_200_OK)    
    
class GetBranchQuotationDetails(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    
    def get(self,request,format=None):
        branch = self.request.query_params.get('branch_id')
        startDate = self.request.query_params.get('startdate')
        endDate = self.request.query_params.get('enddate')
        salesmandata = []
        salesman = []
        lastMonth = datetime.today() - timedelta(days=30)
        quotationApprovedstatus = ['onprocess','pending','completed','partiallycompleted','delivered']
        totalQuotation = quotation.objects.filter(user=branch).count()
        approvedQuotation = quotation.objects.filter(user=branch,status__in=quotationApprovedstatus).count()
        totalIncome = payments.objects.filter(quotation__user=branch).aggregate(sum=Sum('amount'))
        totalExpence = expences.objects.filter(user=branch).aggregate(sum=Sum('amount'))
        totalIncomeLastMonth = payments.objects.filter(date__gte = lastMonth,quotation__user=branch).aggregate(sum=Sum('amount'))
        totalExpenceLastMonth = expences.objects.filter(date__gte = lastMonth,user=branch).aggregate(sum=Sum('amount'))
        
        
        quotationsProgress = quotation.objects.filter(user=branch).aggregate(
            open=Count('pk',filter=Q(status="open")),
            onprocess=Count('pk',filter=Q(status="onprocess")),
            pending=Count('pk',filter=Q(status='pending')),
            completed=Count('pk',filter=Q(status='completed')),
            partilallycompleted=Count('pk',filter=Q(status='partiallycompleted')),
            delivered=Count('pk',filter=Q(status='delivered'))
            )
        jobcardProgress = jobcard.objects.filter(user=branch).aggregate(
            open=Count('pk',filter=Q(status="open")),
            onprocess=Count('pk',filter=Q(status="onprocess")),
            pending=Count('pk',filter=Q(status='pending')),
            completed=Count('pk',filter=Q(status='completed')),
            partilallycompleted=Count('pk',filter=Q(status='partiallycompleted')),
            delivered=Count('pk',filter=Q(status='delivered'))
            )
        getSalesMan = quotation.objects.filter(user=branch)
        for i in getSalesMan: 
            salesman.append(i.created_by.id)
        salesman  = get_user_model().objects.filter(id__in=salesman)
        for i in salesman:
            quotations = quotation.objects.filter(user=branch,created_by = i.id).count()
            jobcards = jobcard.objects.filter(user=branch,quotation__created_by = i.id).count()
            salesManTotalIncome = payments.objects.filter(quotation__created_by = i.id).aggregate(sum=Sum('amount'))
            salesManTotalExpence = expences.objects.filter(created_user = i.id).aggregate(sum=Sum('amount'))
            name = str(i.first_name) +' '+str(i.last_name)
            if i.first_name == '':
                name = i.email
            data = {
                'name':name,
                'email':i.email,
                'quotations':quotations,
                'approved':jobcards,
                'income':salesManTotalIncome,
                'expence':salesManTotalExpence
            }
            salesmandata.append(data)
        context = {
            'totalquotations':totalQuotation,
            'approved':approvedQuotation,
            'totalincome':totalIncome,
            'totalexpence':totalExpence,
            'incomelastmont':totalIncomeLastMonth,
            'expencelastmont':totalExpenceLastMonth,
            'progress':quotationsProgress,
            'jobcardProgress':jobcardProgress,
            'salesman':salesmandata
        }
        return Response(context,status.HTTP_200_OK)
    
class GetBranchQuotationDetails(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def get(self,request,format=None):
        branch = self.request.query_params.get('branch_id')
        branchName = users.objects.get(id=branch).name
        startDate = self.request.query_params.get('startdate')
        endDate = self.request.query_params.get('enddate')
        if startDate == None:
            startDate = '2021-11-22'
        if endDate == None:
            endDate = datetime.now()
        salesmandata = []
        salesman = []
        lastMonth = datetime.today() - timedelta(days=30)
        quotationApprovedstatus = ['onprocess','pending','completed','partiallycompleted','delivered']
        totalQuotation = quotation.objects.filter(date__gte = startDate,date__lte = endDate,user=branch).count()
        approvedQuotation = quotation.objects.filter(date__gte = startDate,date__lte = endDate,user=branch,status__in=quotationApprovedstatus).count()
        totalIncome = payments.objects.filter(date__gte = startDate,date__lte = endDate,quotation__user=branch).aggregate(sum=Sum('amount'))
        totalExpence = expences.objects.filter(date__gte = startDate,date__lte = endDate,user=branch).aggregate(sum=Sum('amount'))
        totalIncomeLastMonth = payments.objects.filter(date__gte = lastMonth,quotation__user=branch).aggregate(sum=Sum('amount'))
        totalExpenceLastMonth = expences.objects.filter(date__gte = lastMonth,user=branch).aggregate(sum=Sum('amount'))
        
        
        quotationsProgress = quotation.objects.filter(date__gte = startDate,date__lte = endDate,user=branch).aggregate(
            open=Count('pk',filter=Q(status="open")),
            onprocess=Count('pk',filter=Q(status="onprocess")),
            pending=Count('pk',filter=Q(status='pending')),
            completed=Count('pk',filter=Q(status='completed')),
            partilallycompleted=Count('pk',filter=Q(status='partiallycompleted')),
            delivered=Count('pk',filter=Q(status='delivered'))
            )
        jobcardProgress = jobcard.objects.filter(created_date__gte = startDate,created_date__lte = endDate,user=branch).aggregate(
            open=Count('pk',filter=Q(status="open")),
            onprocess=Count('pk',filter=Q(status="onprocess")),
            pending=Count('pk',filter=Q(status='pending')),
            completed=Count('pk',filter=Q(status='completed')),
            partilallycompleted=Count('pk',filter=Q(status='partiallycompleted')),
            delivered=Count('pk',filter=Q(status='delivered'))
            )
        getSalesMan = quotation.objects.filter(user=branch)
        for i in getSalesMan: 
            salesman.append(i.created_by.id)
        salesman  = get_user_model().objects.filter(id__in=salesman)
        for i in salesman:
            quotations = quotation.objects.filter(date__gte = startDate,date__lte = endDate,user=branch,created_by = i.id).count()
            jobcards = jobcard.objects.filter(created_date__gte = startDate,created_date__lte = endDate,user=branch,quotation__created_by = i.id).count()
            salesManTotalIncome = payments.objects.filter(date__gte = startDate,date__lte = endDate,quotation__created_by = i.id).aggregate(sum=Sum('amount'))
            salesManTotalExpence = expences.objects.filter(date__gte = startDate,date__lte = endDate,created_user = i.id).aggregate(sum=Sum('amount'))
            name = str(i.first_name) +' '+str(i.last_name)
            if i.first_name == '':
                name = i.email
            data = {
                'name':name,
                'email':i.email,
                'quotations':quotations,
                'approved':jobcards,
                'income':salesManTotalIncome,
                'expence':salesManTotalExpence
            }
            salesmandata.append(data)
        context = {
            'branchname':branchName,
            'totalquotations':totalQuotation,
            'approved':approvedQuotation,
            'totalincome':totalIncome,
            'totalexpence':totalExpence,
            'incomelastmont':totalIncomeLastMonth,
            'expencelastmont':totalExpenceLastMonth,
            'progress':quotationsProgress,
            'jobcardProgress':jobcardProgress,
            'salesman':salesmandata
        }
        return Response(context,status.HTTP_200_OK)
    
    
class CheckPassword(APIView):
    permission_classes = (IsAuthenticated,IsAdminUser)
    def post(self,request,format=None):
        user = self.request.query_params.get('userid')
        changePassword = get_user_model().objects.get(id=user)
        print(request.POST['password'])
        changePassword.set_password(request.POST['password'])
        changePassword.save()
        return Response({'msg':'password updated successfully'})

        