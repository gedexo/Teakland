from asyncio import trsock
from datetime import datetime
from email.errors import NoBoundaryInMultipartDefect
from email.policy import HTTP
import imp
import json
from mmap import PROT_READ
from pickle import TRUE
from posixpath import split
from statistics import quantiles
from traceback import print_tb
from django import views
from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import status, viewsets
from rest_framework.response import Response 
from officialapi.models import category, expences, kattla, others, payments,row_materials,quotation,joint_type,door,window,quotation_door_item,quotation_window_item,quotation_kattla_item ,salesman,customer,\
    custom_kattla,quotation_customkattla_item,feedback,qoutation_feedback,jobcard,invoice,factory,expences,other_products_item,issues
from .serializer import CategorySerializer, ExpenceSerializer,ViewCategorySerializer,SalesManSerializer,\
    CustomerSerializer,ViewCustomerSerializer,RowMaterialSerializer,DoorUnitPriceSerializer,quotationSerializer,JointTypeSerializer,DoorSerializer,\
        GetDoorsSerializer,WindowSerializer,GetWindowSerializer,KattlaSerializer,GetKattlaSerializer,KattlaUnitPriceSerializer,\
            WindowUnitPriceSerializer,CreateQuatationDoorSerializer,CreateQuatationKattlaSerializer,CreateQuatationWindowSerializer,UpdateQuotationSerializer,\
                GetQuatation,GetQuatationDoorSerializer,GetQuatationKattlaSerializer,GetQuatationWindowSerializer,GetCustomKattlaSerializer,CustomKattlaUnitPriceSerializer,\
                    CreateQuatationCustomKattlaSerializer,GetQuatationCustomKattlaSerializer,FeedBackSerializer,GetFeedBackSerializer,QuotationFeedBackSerializer,GetQuotationFeedBackSerializer,\
                        JobCardAndInvoieHelperSerializer,JobCardSerializer,InvoiceSerializer,PaymentSerializer,ViewJobCardSerializer,ViewInvoiceSerializer,GetPaymentSerializer,GetExpencesSerializer,\
                            OtherProductsQuotationSeralizer,GetOtherProductsQuotationSeralizer,IssueSerializer,GetIssueSerrializer                                                                                                                                                                                               
from . permissions import FeedBackPermission,JobCardPermission,BasicUserPermission,QuotationPermissions
from rest_framework.exceptions import ValidationError
from . unit_price import doorunitprice, kattlaunitprice,windowunitprice,customkattlarunitprice
from . jobcard_helper import recievedCash, validatecash,quotationno
import datetime 
from django.utils import timezone
import itertools
from django.contrib.auth.hashers import make_password, check_password
from django.db.models import Q

class CheckUser(APIView):
    permission_classes = (IsAuthenticated,)
    def get(self,request):
        if self.request.user.is_superuser == False and self.request.user.is_active == True:
            return Response({'id':self.request.user.id}, status=status.HTTP_200_OK)
        if self.request.user.is_superuser == True and self.request.user.is_active == True and self.request.user.user != None:
            return Response({'id':self.request.user.id}, status=status.HTTP_200_OK)
        else:
            return Response({}, status=status.HTTP_401_UNAUTHORIZED)

class UserPermission(APIView):
    def get(self, request,pk,format=None):
        user = get_user_model()
        check = user.objects.get(id = pk)
        if check.is_active == True:
            return Response({},status.HTTP_200_OK)
        else:
            return Response({},status.HTTP_400_BAD_REQUEST)

class Category(viewsets.ModelViewSet):
    '''Endpoint to create and list category'''
    queryset = category.objects.all()
    serialier_class = CategorySerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        return self.queryset.filter(user = self.request.user.user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            if category.objects.filter(user=self.request.user.user,name = self.request.POST['name']).exists():
                res = ValidationError({'message':'Category exists already'})
                res.status_code = 208
                raise res
            else:  
                serializer.save(user=self.request.user.user)
        
    def perform_update(self, serializer):
        if serializer.is_valid():
            if category.objects.filter(user=self.request.user.user,name = self.request.POST['name']).exclude(id=self.kwargs['pk']).exists():
                res = ValidationError({'message':'Category exists already'})
                res.status_code = 208
                raise res
            else:  
                serializer.save(user=self.request.user.user)
               
    def get_serializer_class(self):
        if self.action == 'create':
            return CategorySerializer
        elif self.action == 'update':
            return CategorySerializer
        else:
            return ViewCategorySerializer

class SalesMan(viewsets.ModelViewSet):
    '''Endpoint to create and list product'''
    queryset = salesman.objects.all()
    serialier_class = SalesManSerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        branch = self.request.query_params.get('branch')
        if branch != None:
            print(branch)
            return self.queryset.filter(user = branch)
        return self.queryset.filter(user = self.request.user.user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            if salesman.objects.filter(user=self.request.user.user,name = self.request.POST['name'],phone=self.request.POST['phone']).exists():
                res = ValidationError({'message':'Salesman exists already'})
                res.status_code = 208
                raise res
            else:  
                serializer.save(user=self.request.user.user)
                
    def perform_update(self, serializer):
        if serializer.is_valid():
            if salesman.objects.filter(user=self.request.user.user,name = self.request.POST['name'],phone=self.request.POST['phone']).exclude(id=self.kwargs['pk']).exists():
                res = ValidationError({'message':'Salesman exists already'})
                res.status_code = 208
                raise res
            else:  
                return super().perform_update(serializer)
    
    def get_serializer_class(self):
       return SalesManSerializer
        

class Customer(viewsets.ModelViewSet):
    queryset = customer.objects.all()
    serialier_class = CustomerSerializer
    permission_classes = (IsAuthenticated,)
    
    def get_queryset(self):
        is_enquiry = self.request.query_params.get('is_enquiry')
        if is_enquiry != None:
            return self.queryset.filter(user = self.request.user.user,is_enquiry=is_enquiry)
        
        return self.queryset.filter(user = self.request.user.user,)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user.user)
                
    def get_serializer_class(self):
        if self.action == 'list':
            return ViewCustomerSerializer
        elif self.action == 'retrieve':
            return ViewCustomerSerializer
        return CustomerSerializer
    
class RowMaterials(viewsets.ModelViewSet):
    '''Endpoint to create and list rowmaterials'''
    queryset = row_materials.objects.all()
    serialier_class = RowMaterialSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get','list','retrieve']

    def get_serializer_class(self):
       return RowMaterialSerializer

class GetUnitPriceOfDoor(APIView):
    """
        Return Unit Price of The Door and Labour Charge Per unit
        Calculate Amount using - (H * W * unit Price from record (1sqft) ) + Labour Charge
        Calculate total By multiplying with Quantity 
    """

    permission_classes = (IsAuthenticated,)
    serializer_class=DoorUnitPriceSerializer
    
    def post(self, request, format=None):
        
        serializer = DoorUnitPriceSerializer(data=request.data)
        if serializer.is_valid():
            unitAmount = ''
            sqft = ''
            raw_material_id=serializer.data['raw_material_id']
            door_type=serializer.data['door_type']
            joint_id=serializer.data['joint_id']
            height = serializer.data['height']
            width = serializer.data['width']
            
            if door.objects.filter(rowmaterial__id=raw_material_id,doortype=door_type,joint__id=joint_id).exists():
                doorprice=door.objects.get(rowmaterial__id=raw_material_id,doortype=door_type,joint__id=joint_id)
                obj = {'raw_material':raw_material_id,'doortype':door_type,'joint':joint_id,'height':height,'width':width,'doorprice':doorprice.price,"labourcharge":doorprice.labour_charge,"factory_price":doorprice.factory_price}
                unit = doorunitprice(**obj)
                unit.unitprice()
                listC = list(unit.unitprice())
                unitAmount= listC[1]
                factoryUnitAmount= listC[2]
                sqft = listC[0]
                return Response({"item":"Door","unitprice":doorprice.price,"labourcharge":doorprice.labour_charge,"unitamount":unitAmount,"factory_unitamount":factoryUnitAmount,"sqft":sqft})
            else:
                return Response({"message":"No product matching found"},status.HTTP_404_NOT_FOUND)

        return Response({"message":"Bad Request Check server log"},status.HTTP_400_BAD_REQUEST)
    
class GetUnitPriceOfWindow(APIView):
    """
        Return Unit Price of The Door and Labour Charge Per unit
        Calculate Amount using - (H * W * unit Price from record (1sqft) ) + Labour Charge
        Calculate total By multiplying with Quantity 
    """

    permission_classes = (IsAuthenticated,)
    serializer_class=WindowUnitPriceSerializer
    
    def post(self, request, format=None):
        
        serializer = WindowUnitPriceSerializer(data=request.data)
        if serializer.is_valid():
            unitAmount = ''
            sqft = ''
            raw_material_id=serializer.data['raw_material_id']
            box = serializer.data['box']
            design = serializer.data['design']
            shutter = serializer.data['shutter']
            height = serializer.data['dimention_height']
            width = serializer.data['dimention_width']
            
            if window.objects.filter(rowmaterial__id=raw_material_id,box=box,shutter=shutter,design = design).exists():
                windowPrice=window.objects.get(rowmaterial__id=raw_material_id,box=box,shutter=shutter,design = design)
                obj = {'raw_material':raw_material_id,'box':box,'height':height,'width':width,'shutter':shutter,'windowprice':windowPrice.price,'factory_price':windowPrice.factory_price,"labourcharge":windowPrice.labour_charge}
                unit = windowunitprice(**obj)
                unit.unitprice()
                listC = list(unit.unitprice())
                unitAmount= listC[1]
                factoryunitAmount= listC[2]
                sqft = listC[0]
                return Response({"item":"Door","unitprice":windowPrice.price,"factoryunitamount":factoryunitAmount,"labourcharge":windowPrice.labour_charge,"unitamount":unitAmount,'sqft':sqft})
            else:
                return Response({"message":"No product matching found"},status.HTTP_404_NOT_FOUND)

        return Response({"message":"Bad Request Check server log"},status.HTTP_400_BAD_REQUEST)

class GetUnitPriceOfCustomfKattla(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class=CustomKattlaUnitPriceSerializer
    
    def post(self, request, format=None):
        
        serializer = CustomKattlaUnitPriceSerializer(data=request.data)
        if serializer.is_valid():
            unitAmount = ''
            qubic = ''
            labourCharge = 0
            raw_material_id=serializer.data['raw_material_id']
            length = serializer.data['length']
            thickness_x = serializer.data['thickness_x']
            thickness_y = serializer.data['thickness_y']
            labour_charge =  serializer.data['labour_charge']
            if custom_kattla.objects.filter(rowmaterial__id=raw_material_id).exists():
                kattlaPrice=custom_kattla.objects.get(rowmaterial__id=raw_material_id)
                obj = {'raw_material':raw_material_id,'length':length,'thicknes_x':thickness_x,'thicknes_y':thickness_y,'kattlaprice':kattlaPrice.price,'factory_price':kattlaPrice.factory_price,"labourcharge":labour_charge}
                unit = customkattlarunitprice(**obj)
                unit.unitprice()
                listC = list(unit.unitprice())
                unitAmount= listC[1]
                factoryunitAmount= listC[2]
                qubic = listC[0]
                return Response({"item":"Door","unitprice":kattlaPrice.price,"labourcharge":labour_charge,"unitamount":unitAmount,"factoryunitamount":factoryunitAmount,'qubic':qubic})
            else:
                return Response({"message":"No product matching found"},status.HTTP_404_NOT_FOUND)

        return Response({"message":serializer.errors},status.HTTP_400_BAD_REQUEST)
    
class GetUnitPriceOfKattla(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class= KattlaUnitPriceSerializer    
    def post(self, request, format=None):
         
        serializer = KattlaUnitPriceSerializer(data=request.data)
        if serializer.is_valid():
            unitAmount = ''
            qubic = ''
            raw_material_id=serializer.data['raw_material_id']
            type=serializer.data['type']
            height = serializer.data['dimention_height']
            width = serializer.data['dimention_width']
            thicknes_x = serializer.data['thickness_x']
            thicknes_y = serializer.data['thickness_y']
            labour_charge =  serializer.data['labour_charge']
            
            if kattla.objects.filter(rowmaterial__id=raw_material_id,kattlatype=type).exists():
                kattlaprice=kattla.objects.get(rowmaterial__id=raw_material_id,kattlatype=type)
                if labour_charge != 'false':
                    labourcharge = kattlaprice.labour_charge
                else:
                    labourcharge = 0
                obj = {'raw_material':raw_material_id,'type':type,'height':height,'width':width,'thicknes_x':thicknes_x,'thicknes_y':thicknes_y,'kattlaprice':kattlaprice.price,'factory_price':kattlaprice.factory_price,'labourcharge':labourcharge,'doortype':kattlaprice.open_closed,'nofoboxes':kattlaprice.noofboxes}
                unit = kattlaunitprice(**obj)
                unit.unitprice()
                listC = list(unit.unitprice())
                unitAmount= listC[1]
                factoryunitAmount= listC[2]
                qubic = listC[0]
                    
                return Response({"item":"Door","labourcharge":kattlaprice.labour_charge,"unitamount":unitAmount,"factory_unit_amount":factoryunitAmount,"qubic":qubic})
            else:
                return Response({"message":"No product matching found"},status.HTTP_404_NOT_FOUND)

        return Response({"message":"Bad Request Check server log"},status.HTTP_400_BAD_REQUEST)

class GetOtherSaleAmount(APIView):
    permission_classes = (IsAuthenticated,)
    
    def post(self,request,format=None):
        rawMaterial = request.POST['raw_material_id']
        type = request.POST['type']
        if others.objects.filter(rowmaterial=rawMaterial,name=type).exists():
            salesPrice = others.objects.get(rowmaterial=rawMaterial,name=type).sales_rate
            return Response({'sales_price':salesPrice},status.HTTP_200_OK)
        return Response(status.HTTP_404_NOT_FOUND)

class JointType(viewsets.ModelViewSet):
    '''Endpoint to create and list jointtype'''
    queryset = joint_type.objects.all()
    serialier_class = JointTypeSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get','list','retrieve']
    def get_serializer_class(self):
        return JointTypeSerializer
     
class Doors(viewsets.ModelViewSet):
    '''Endpoint to create and list doors products'''
    queryset = door.objects.all()
    serialier_class = GetDoorsSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get','list','retrieve']
    
    def get_serializer_class(self):
        return GetDoorsSerializer


class Window(viewsets.ModelViewSet):
    '''Endpoint to create and list doors products'''
    queryset = window.objects.all()
    serialier_class = GetWindowSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get','list','retrieve']
    
    def get_queryset(self):
        rawmaterial = self.request.query_params.get('rawmaterial')
        print(rawmaterial)
        if rawmaterial != None:
            return self.queryset.filter(rowmaterial = rawmaterial)
        return self.queryset.all()
    
    def get_serializer_class(self):
        return GetWindowSerializer
    
class Kattla(viewsets.ModelViewSet):
    queryset = kattla.objects.all()
    serialier_class = GetKattlaSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get','list','retrieve']
    
    def get_queryset(self):
        rowmaterial = self.request.query_params.get('row_material')
        if rowmaterial != None:
            return self.queryset.filter(rowmaterial = rowmaterial).order_by('rowmaterial')
        return self.queryset.all().order_by('rowmaterial')
    
    def get_serializer_class(self):
        return GetKattlaSerializer
    
class CustomKattla(viewsets.ModelViewSet):
    queryset = custom_kattla.objects.all()
    serialier_class = GetCustomKattlaSerializer
    permission_classes = (IsAuthenticated,)
    http_method_names = ['get','list','retrieve']
    
    def get_serializer_class(self):
        return GetCustomKattlaSerializer
    
class GetQuatationNumber(APIView):
    permission_classes = (IsAuthenticated,)
    
    def get(self,request):
        if quotation.objects.filter(user=self.request.user.user).exists():
            quotationId = quotation.objects.filter(user=self.request.user.user).latest('pk')
            quotataionNumber = quotationno(self.request.user.user.branch_key,quotationId.quoation_number)
            return Response({'quatation_number':quotataionNumber})
        else:
            quotataionNumber = quotationno(self.request.user.user.branch_key,0)
            return Response({'quatation_number':quotataionNumber})
    
class user_create_quotation(viewsets.ModelViewSet):
    queryset = quotation.objects.all()
    serializer_class = quotationSerializer
    permission_classes = [BasicUserPermission,]
    
    def get_queryset(self):
        quotation = self.request.query_params.get('quotation_number')
        factory = self.request.query_params.get('factory')
        print(factory)
        
        if quotation != None:
            if self.queryset.filter(quoation_number=quotation).exists():
                return self.queryset.filter(quoation_number=quotation)
            else:
                res = ValidationError({'message':'There is no qoutaion in this qoutationnumber'})
                res.status_code = 400
                raise res
        elif factory != None:
            return self.queryset.all() 
        else:
            return self.queryset.filter(user = self.request.user.user).order_by('-id')
    
    def perform_create(self, serializer):
        if serializer.is_valid:
            if quotation.objects.filter(user=self.request.user.user).exists():
                quotationId = quotation.objects.filter(user=self.request.user.user).latest('pk')
                quotataionNumber = quotationno(self.request.user.user.branch_key,quotationId.quoation_number)
            else:
                quotataionNumber = quotationno(self.request.user.user.branch_key,0)
            serializer.save(user=self.request.user.user,quoation_number=quotataionNumber,created_by=self.request.user)
    
    def perform_update(self, serializer):
        return super().perform_update(serializer)
    
    def get_serializer_class(self):
        if self.action == 'update':
            UpdateQuotationSerializer
        elif self.action == 'list' or self.action == 'retrieve':
            return GetQuatation
        
        return quotationSerializer       
    
class CreateQuotationForDoor(viewsets.ModelViewSet):
    queryset = quotation_door_item.objects.all()
    serializer_class = CreateQuatationDoorSerializer
    permission_classes = [QuotationPermissions]
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            joint = joint_type.objects.get(id=self.request.POST['joint'])
            jointType = joint.code +'-'+ joint.joint_type
            serializer.save(joint=jointType)
    
    def get_queryset(self):
        quotationNo = self.request.query_params.get('quotation_no')
        factory = self.request.query_params.get('factory')
        if quotationNo != None and factory != None:
            return self.queryset.filter(quotation = quotationNo, factory=self.request.user.factory)
        elif quotationNo != None:
            return self.queryset.filter(quotation = quotationNo)
        else:
            return self.queryset.all()
        
    def perform_update(self, serializer):
        return super().perform_update(serializer)
       
    def destroy(self, request, *args, **kwargs):
        quotationId = self.queryset.get(id=self.kwargs['pk'])
        if jobcard.objects.filter(quotation=quotationId.quotation).exists():
            res = ValidationError({'message':'cannot delete this product from quotation'})
            res.status_code = 406
            raise res
        else:
            return super().destroy(request, *args, **kwargs)
             
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return GetQuatationDoorSerializer
        return CreateQuatationDoorSerializer
    
class CreateQuotationForKattla(viewsets.ModelViewSet):
    queryset = quotation_kattla_item.objects.all()
    serializer_class = CreateQuatationKattlaSerializer
    permission_classes = [QuotationPermissions]
    def get_queryset(self):
        quotationNo = self.request.query_params.get('quotation_no')
        factory = self.request.query_params.get('factory')
        if quotationNo != None and factory != None:
            return self.queryset.filter(quotation = quotationNo, factory=self.request.user.factory)
        elif quotationNo != None:
            return self.queryset.filter(quotation = quotationNo)
        else:
            return self.queryset.all()
        
    def destroy(self, request, *args, **kwargs):
        quotationId = self.queryset.get(id=self.kwargs['pk'])
        if jobcard.objects.filter(quotation=quotationId.quotation).exists():
            res = ValidationError({'message':'cannot delete this product from quotation'})
            res.status_code = 406
            raise res
        else:
            return super().destroy(request, *args, **kwargs)
        
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return GetQuatationKattlaSerializer
        return CreateQuatationKattlaSerializer

class CreateQuotationForWindow(viewsets.ModelViewSet):
    queryset = quotation_window_item.objects.all()
    serializer_class = CreateQuatationWindowSerializer
    permission_classes = [QuotationPermissions]
    
    def get_queryset(self):
        quotationNo = self.request.query_params.get('quotation_no')
        factory = self.request.query_params.get('factory')
        if quotationNo != None and factory != None:
            return self.queryset.filter(quotation = quotationNo, factory=self.request.user.factory)
        elif quotationNo != None:
            return self.queryset.filter(quotation = quotationNo)
        else:
            return self.queryset.all()
    
    def destroy(self, request, *args, **kwargs):
        quotationId = self.queryset.get(id=self.kwargs['pk'])
        if jobcard.objects.filter(quotation=quotationId.quotation).exists():
            res = ValidationError({'message':'cannot delete this product from quotation'})
            res.status_code = 406
            raise res
        else:
            return super().destroy(request, *args, **kwargs)
        
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return GetQuatationWindowSerializer     
        return CreateQuatationWindowSerializer
    
class CreateQuotationForCustomKattla(viewsets.ModelViewSet):
    queryset = quotation_customkattla_item.objects.all()
    serializer_class = CreateQuatationCustomKattlaSerializer
    permission_classes = [QuotationPermissions]
    
    def get_queryset(self):
        quotationNo = self.request.query_params.get('quotation_no')
        factory = self.request.query_params.get('factory')
        if quotationNo != None and factory != None:
            return self.queryset.filter(quotation = quotationNo, factory=self.request.user.factory)
        elif quotationNo != None:
            return self.queryset.filter(quotation = quotationNo)
        else:
            return self.queryset.all()
    
    def destroy(self, request, *args, **kwargs):
        quotationId = self.queryset.get(id=self.kwargs['pk'])
        if jobcard.objects.filter(quotation=quotationId.quotation).exists():
            res = ValidationError({'message':'cannot delete this product from quotation'})
            res.status_code = 406
            raise res
        else:
            return super().destroy(request, *args, **kwargs)
        
    def get_serializer_class(self):
        
        if self.action == 'list' or self.action == 'retrieve':
            return GetQuatationCustomKattlaSerializer     
        return CreateQuatationCustomKattlaSerializer
    
class CreateQuotationForOtherProducts(viewsets.ModelViewSet):
    queryset = other_products_item.objects.all()
    serializer_class = OtherProductsQuotationSeralizer
    permission_classes = [QuotationPermissions]
    
    def get_queryset(self):
        quotationNo = self.request.query_params.get('quotation_no')
        factory = self.request.query_params.get('factory')
        if quotationNo != None and factory != None:
            return self.queryset.filter(quotation = quotationNo, factory=self.request.user.factory)
        elif quotationNo != None:
            return self.queryset.filter(quotation = quotationNo)
        else:
            return self.queryset.all()
        
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return GetOtherProductsQuotationSeralizer
        return OtherProductsQuotationSeralizer
    
class FeedBacks(viewsets.ModelViewSet):
    queryset = feedback.objects.all()
    serialier_class = FeedBackSerializer
    permission_classes = [FeedBackPermission]
    
    def get_queryset(self):
        self.queryset.filter(is_seen=False).update(is_seen=True)
        return self.queryset.all().order_by('-date')
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            customerObj = customer.objects.get(id= self.request.POST['customer_id'])
            name = customerObj.name
            phone = customerObj.contact_no
            serializer.save(user = self.request.user.user,deleted_user=self.request.user,customername=name,customernumber=phone)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return GetFeedBackSerializer     
        return FeedBackSerializer
     

class QoutationFeedBacks(viewsets.ModelViewSet):
    queryset = qoutation_feedback.objects.all()
    serialier_class = QuotationFeedBackSerializer
    permission_classes = [FeedBackPermission]
    
    def get_queryset(self):
        return self.queryset.filter(is_seen= False)
    
    def perform_update(self, serializer):
        print(self.request.POST)
        return super().perform_update(serializer)
        
    def perform_create(self, serializer):
        serializer.save(user = self.request.user.user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return GetQuotationFeedBackSerializer     
        return QuotationFeedBackSerializer
     

class JobCardAndInvoice(APIView):
    permission_classes = (IsAuthenticated,)
    serializer_class=JobCardAndInvoieHelperSerializer

    def post(self, request, format=None):
                    
        serializer = JobCardAndInvoieHelperSerializer(data=request.data)
        if serializer.is_valid():
            quotationno=serializer.data['quotationno']
            recievedcash = serializer.data['recievedcash']
            estimationAmount = serializer.data['estimation_amount']
            excepted_delivery = serializer.data['excepted_delivery']
            users = self.request.user.user
            createduser = self.request.user
            a = validatecash(quotationno)
            jobcardno = ''
            invoiceno = ''
            quotationObj = quotation.objects.get(id=quotationno)
            if quotationObj.created_by == self.request.user or self.request.user.is_superuser == True or self.request.user.is_branchhead == True:
                if a > 0 and recievedcash > 0:
                    quotatationNo = quotation.objects.get(id=quotationno)
                    jobcardno = quotatationNo.quoation_number
                
                    jobcard_serializer= JobCardSerializer(data=request.data)
                    if jobcard_serializer.is_valid():
                        jobcard_serializer.save(created_date=datetime.datetime.now(tz=timezone.utc),estimation_amount=estimationAmount,user = users,jobcardno=jobcardno,quotation=quotationObj,expected_delivery=excepted_delivery,created_user=createduser)

                    if invoice.objects.all().exists():
                        invoiceId = invoice.objects.latest('pk').pk+1
                        invoiceno = str('TKIN0')+str(invoiceId)
                    else:
                        invoiceId = 1
                        invoiceno = str('TKIN0')+str(invoiceId)
                    Invoice_serializer= InvoiceSerializer(data=request.data)
                    if Invoice_serializer.is_valid():
                        Invoice_serializer.save(user = users,invoiceno=invoiceno,quotation=quotationObj,created_user=createduser)

                    quotationStatus = quotation.objects.get(id=quotationno)
                    quotationStatus.status = 'onprocess'
                    quotationStatus.save()
                    return Response({'jobcard':jobcardno,'invoice':invoiceno},status.HTTP_201_CREATED)
                elif recievedcash > a :
                    return Response({'recieved cash greater than total amount':'msg'},status.HTTP_409_CONFLICT)
                else:
                    return Response({'recieved amount less than 1':'msg'},status.HTTP_400_BAD_REQUEST)
            else:
                return Response({'msg':'You dont have permission for this action'},status.HTTP_403_FORBIDDEN)
        else:
            return Response({'msg':serializer.errors},status.HTTP_406_NOT_ACCEPTABLE)

class Payments(viewsets.ModelViewSet):
    queryset = payments.objects.all()
    serialier_class = PaymentSerializer
    permission_classes = [QuotationPermissions]  
    
    def get_queryset(self):
        quotation = self.request.query_params.get('quotation_number')
        if quotation != None:
            return self.queryset.filter(quotation=quotation)
        return self.queryset.filter(quotation__user=self.request.user.user)
    
    def perform_create(self, serializer):
        if serializer.is_valid():
            quotationNo = self.request.POST['quotation']
            a = recievedCash(quotationNo)
            b = validatecash(quotationNo)
            c = self.request.POST['amount']                                      
            recievedAmount = int(a) + int(c)
            if recievedAmount >  b:
                res = ValidationError({'message':'Recieved amount is high'})
                res.status_code = 406
                raise res
            else:
                serializer.save(created_user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'list':
            return GetPaymentSerializer
        return PaymentSerializer
        
class JobCards(viewsets.ModelViewSet):
    queryset = jobcard.objects.all()
    serialier_class = ViewJobCardSerializer
    permission_classes = (IsAuthenticated,)

    http_method_names = ['get','list','retrieve']
    
    def get_queryset(self):
        jobcardNo = self.request.query_params.get('jobcard_number')
        status = self.request.query_params.get('status')
        statusLIst= []
        if status != None:
            if status == 'completed':
                statusLIst.append('completed')
                statusLIst.append('partiallycompleted')
            else:
                statusLIst.append(status)
            return self.queryset.filter(status__in=statusLIst,user=self.request.user.user)
        elif jobcardNo != None:
            return self.queryset.filter(jobcardno=jobcardNo)            
        return self.queryset.filter(user=self.request.user.user).exclude(status='delivered')

    def partial_update(self, request, *args, **kwargs):
        quotationId = jobcard.objects.get(id=self.kwargs['pk'])
        updateQuotation = quotation.objects.get(id=quotationId.quotation.id)
        updateQuotation.status = request.POST['status']
        updateQuotation.save()
        return super().partial_update(request, *args, **kwargs)
    
    def get_serializer_class(self):
        return ViewJobCardSerializer

class Invoices(viewsets.ModelViewSet):
    queryset = invoice.objects.all()
    serialier_class = ViewInvoiceSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        invoiceNo = self.request.query_params.get('invoice_number')
        quotationNo = self.request.query_params.get('quotation_number')
        if invoiceNo != None and quotationNo != None:
            if self.queryset.filter(invoiceno=invoiceNo,quotation=quotationNo).exists():
                return self.queryset.filter(invoiceno=invoiceNo)
            else:
                res = ValidationError({'message':'Recieved amount is high'})
                res.status_code = 400
                raise res
        elif invoiceNo != None:
            return self.queryset.filter(invoiceno=invoiceNo)
        return self.queryset.filter(user=self.request.user.user)
    
    def get_serializer_class(self):
        return ViewInvoiceSerializer
    
class Expences(viewsets.ModelViewSet):
    queryset = expences.objects.all()
    serialier_class = ExpenceSerializer
    permission_classes = [BasicUserPermission]
    
    def get_queryset(self):
        startDate = self.request.query_params.get('startdate')
        endDate = self.request.query_params.get('enddate')
        category = self.request.query_params.get('category')
        branch = self.request.query_params.get('branch')
        status = self.request.query_params.get('status')
        if self.request.user.is_superuser == True and status == None:
            if startDate != None:
                categorys = json.loads(category)
                branches = json.loads(branch)
                return self.queryset.filter(date__gte=startDate,date__lte=endDate,category__in=categorys,user__in=branches)
            return self.queryset.all()
        elif startDate != None and endDate != None:
            return self.queryset.filter(date__gte = startDate, date__lte = endDate,user=self.request.user.user)
        elif status == 'branch':
            return self.queryset.filter(user=self.request.user.user)
    
    def perform_create(self, serializer):
        serializer.save(user = self.request.user.user, created_user= self.request.user)
        
    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return GetExpencesSerializer
        return ExpenceSerializer
    
class Issuses(viewsets.ModelViewSet):
    serialier_class = IssueSerializer
    permission_classes = (IsAuthenticated,)
    queryset = issues.objects.all()
    
    def get_queryset(self):
        quotationId = self.request.query_params.get('quotationid')
        if quotationId != None:
            return self.queryset.filter(quotationno=quotationId)
        else:
            issues.objects.filter(is_seen=False).update(is_seen=True)
            return self.queryset.all()
    
    def perform_create(self, serializer):
        serializer.save(created_user = self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'Get' or self.action == 'list':
            return GetIssueSerrializer
        return IssueSerializer
    
    
    