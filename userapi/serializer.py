from rest_framework import serializers
from officialapi.models import User, category, factory, joint_type, kattla, quotation_customkattla_item,salesman,customer,row_materials,joint_type,door,window,quotation,\
            kattla,quotation_door_item,quotation_kattla_item,quotation_window_item,custom_kattla,feedback,qoutation_feedback,jobcard,invoice,payments,expences,\
                other_products_item,issues
from versatileimagefield.serializers import VersatileImageFieldSerializer
from rest_framework.exceptions import ValidationError
from rest_framework import status
from rest_framework.response import Response
from django.db.models.aggregates import Count
from django.forms.models import model_to_dict
from django.db.models import Sum
from . jobcard_helper import validatecash,recievedCash
from officialapi.serializer import BankSerializer, FactorySerializer, UserSerializer,CustUserSerializer,ExpenceCategorySerializer
import itertools

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = category
        fields = '__all__'
        read_only_fields = ('user',)

class ViewCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = category
        fields = '__all__'
        
class SalesManSerializer(serializers.ModelSerializer):
    class Meta:
        model = salesman
        fields = '__all__'
        read_only_fields = ('user',)
        
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = customer
        fields = '__all__'
        read_only_fields = ('user',)
        
class ViewCustomerSerializer(serializers.ModelSerializer):
    dealt_by = SalesManSerializer()
    created_by = SalesManSerializer()
    customerstatus = serializers.SerializerMethodField()
    class Meta:
        model = customer
        fields = '__all__'
        read_only_fields = ('user',)
        
    def get_customerstatus(self,obj):
        if quotation.objects.filter(customer=obj).exists():
            return True
        else:
            return False
        
class RowMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = row_materials
        fields = '__all__'

# Quotation Serializer for SalesMan 
class quotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = quotation
        fields = '__all__'
        read_only_fields = ('user','quoation_number',)
        
class quotationSerializerForInvoice(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    class Meta:
        model = quotation
        fields = '__all__'
        read_only_fields = ('user','quoation_number',)
        
class UpdateQuotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = quotation
        fields = '__all__'

class DoorUnitPriceSerializer(serializers.Serializer):
    raw_material_id = serializers.IntegerField()   # replace With Row material serializer if required
    door_type = serializers.CharField(max_length=200)
    joint_id=serializers.IntegerField()   # replace With Row Joint serializer if required
    height = serializers.FloatField()
    width = serializers.FloatField()
    
class KattlaUnitPriceSerializer(serializers.Serializer):
    raw_material_id = serializers.IntegerField()   # replace With Row material serializer if required
    type = serializers.CharField(max_length=200)
    dimention_height = serializers.FloatField()
    dimention_width = serializers.FloatField()
    labour_charge = serializers.CharField()
    thickness_x = serializers.FloatField()
    thickness_y = serializers.FloatField()
    
class WindowUnitPriceSerializer(serializers.Serializer):
    raw_material_id = serializers.IntegerField()   # replace With Row material serializer if required
    box = serializers.IntegerField()
    design = serializers.CharField()
    dimention_height = serializers.FloatField()
    dimention_width = serializers.FloatField()
    shutter = serializers.FloatField()
    
class CustomKattlaUnitPriceSerializer(serializers.Serializer):
    raw_material_id = serializers.IntegerField()   # replace With Row material serializer if required
    length = serializers.FloatField()
    thickness_x = serializers.FloatField()
    thickness_y = serializers.FloatField()
    labour_charge = serializers.CharField()

class JointTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = joint_type
        fields = '__all__'
        
class DoorSerializer(serializers.ModelSerializer):
    class Meta:
        model = door
        fields = '__all__'
        
class GetDoorsSerializer(serializers.ModelSerializer):
    rowmaterial = RowMaterialSerializer()
    joint = JointTypeSerializer()
    image_one = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    image_two = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    image_three = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    class Meta:
        model = door
        fields = '__all__'

class WindowSerializer(serializers.ModelSerializer):
    class Meta:
        model = window
        fields = '__all__'
        
class GetWindowSerializer(serializers.ModelSerializer):
    rowmaterial = RowMaterialSerializer()
    image_one = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    image_two = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    image_three = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    class Meta:
        model = window
        fields = '__all__'

class KattlaSerializer(serializers.ModelSerializer):
    class Meta:
        model = kattla
        fields = '__all__'
        
class GetKattlaSerializer(serializers.ModelSerializer):
    rowmaterial = RowMaterialSerializer()
    image_one = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    image_two = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    image_three = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    class Meta:
        model = kattla
        fields = '__all__'
        
class GetCustomKattlaSerializer(serializers.ModelSerializer):
    rowmaterial = RowMaterialSerializer()
    image_one = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    image_two = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    image_three = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    class Meta:
        model = custom_kattla
        fields = '__all__'
        
class CreateQuatationDoorSerializer(serializers.ModelSerializer):
    class Meta:
        model = quotation_door_item
        fields = '__all__'
        read_only_fields = ('joint',)

class GetQuatationDoorSerializer(serializers.ModelSerializer):
    raw_material = RowMaterialSerializer(read_only= True)
    factory = FactorySerializer(read_only=True)
    image = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    class Meta:
        model = quotation_door_item
        fields = '__all__'                                                                                                                                                                                                                                                                                                
        
class CreateQuatationKattlaSerializer(serializers.ModelSerializer):
    class Meta:
        model = quotation_kattla_item
        fields = '__all__'

class GetQuatationKattlaSerializer(serializers.ModelSerializer):
    raw_material = RowMaterialSerializer(read_only= True)
    factory = FactorySerializer(read_only=True)
    image = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    class Meta:
        model = quotation_kattla_item
        fields = '__all__'

class CreateQuatationWindowSerializer(serializers.ModelSerializer):
    class Meta:
        model = quotation_window_item
        fields = '__all__'

class GetQuatationWindowSerializer(serializers.ModelSerializer):
    raw_material = RowMaterialSerializer(read_only= True)
    factory = FactorySerializer(read_only=True)
    image = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    class Meta:
        model = quotation_window_item
        fields = '__all__' 

class CreateQuatationCustomKattlaSerializer(serializers.ModelSerializer):
    class Meta:
        model = quotation_customkattla_item
        fields = '__all__'

class GetQuatationCustomKattlaSerializer(serializers.ModelSerializer):
    raw_material = RowMaterialSerializer(read_only= True)
    factory = FactorySerializer(read_only=True)
    image = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    class Meta:
        model = quotation_customkattla_item
        fields = '__all__' 

class GetQuotationAndInvoice(serializers.ModelSerializer):
    invoice = serializers.SerializerMethodField()
    class Meta:
        model = quotation
        fields = '__all__'  
        
    def get_invoice(self,obj):
        if invoice.objects.filter(quotation=obj).exists():
            invoiceno = invoice.objects.get(quotation=obj)
            return invoiceno.invoiceno
        else:
            return False     
        
class GetQuatation(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    user = UserSerializer(read_only=True)
    customer = ViewCustomerSerializer(read_only = True)
    doorsubtotal = serializers.SerializerMethodField()
    kattlasubtotal = serializers.SerializerMethodField()
    windowsubtotal = serializers.SerializerMethodField()
    customkattlasubtotal = serializers.SerializerMethodField()
    othersubtotal = serializers.SerializerMethodField()
    hasDeleteRequest = serializers.SerializerMethodField()
    jobcard = serializers.SerializerMethodField()
    invoice = serializers.SerializerMethodField()
    created_by = CustUserSerializer(read_only = True)
    
    class Meta:
        model = quotation
        fields = '__all__'
        
    def get_doorsubtotal(self,obj):
        obj = quotation.objects.filter(id = obj.id).select_related('quotation_door_items__set').annotate(total=Sum('quotation_door_items__aggregate')).values('id','total')
        return obj
    def get_kattlasubtotal(self,obj):
        obj = quotation.objects.filter(id = obj.id).select_related('quotation_kattla_items__set').annotate(total=Sum('quotation_kattla_items__aggregate')).values('id','total')
        return obj
    def get_windowsubtotal(self,obj):
        obj = quotation.objects.filter(id = obj.id).select_related('quotation_window_items__set').annotate(total=Sum('quotation_window_items__aggregate')).values('id','total')
        return obj
    def get_customkattlasubtotal(self,obj):
        obj = quotation.objects.filter(id = obj.id).select_related('quotation_customkattla_items__set').annotate(total=Sum('quotation_cutomkattla_items__aggregate')).values('id','total')
        return obj
    def get_othersubtotal(self,obj):
        obj = quotation.objects.filter(id = obj.id).select_related('quotation_otherproduct_items__set').annotate(total=Sum('quotation_otherproduct_items__aggregate')).values('id','total')
        return obj
    def get_hasDeleteRequest(self,obj):
        if qoutation_feedback.objects.filter(qoutation_number=obj.id).exists():
            return True
        else:
            return False
    
    def get_jobcard(self,obj):
        if jobcard.objects.filter(quotation=obj).exists():
            jobcardno = jobcard.objects.get(quotation=obj)
            return jobcardno.jobcardno
        else:
            return False

    def get_invoice(self,obj):
        if invoice.objects.filter(quotation=obj).exists():
            invoiceno = invoice.objects.get(quotation=obj)
            return invoiceno.invoiceno
        else:
            return False
            
class FeedBackSerializer(serializers.ModelSerializer):
    class Meta:
        model = feedback
        fields = '__all__'
        read_only_fields = ('user','deleted_user','customername','customernumber',)
        
class GetFeedBackSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    deleted_user = CustUserSerializer()
    class Meta:
        model = feedback
        fields = '__all__'
        
class QuotationFeedBackSerializer(serializers.ModelSerializer):
    class Meta:
        model = qoutation_feedback
        fields = '__all__'
        read_only_fields = ('user',)
        
class GetQuotationFeedBackSerializer(serializers.ModelSerializer):
    qoutation_number = quotationSerializerForInvoice(read_only=True)
    user = UserSerializer(read_only=True)
    class Meta:
        model = qoutation_feedback
        fields = '__all__'
        read_only_fields = ('user',)


class JobCardAndInvoieHelperSerializer(serializers.Serializer):
    quotationno = serializers.IntegerField()  
    recievedcash = serializers.IntegerField()
    payment = serializers.CharField()
    excepted_delivery = serializers.DateField(allow_null=True)
    estimation_amount = serializers.FloatField(allow_null=True)

class JobCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = jobcard
        fields = '__all__'
        read_only_fields = ('created_date','user','jobcardno','factory','quotation','expected_delivery','created_user',)


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = invoice
        fields = '__all__'
        read_only_fields = ('user','invoiceno','quotation','created_user',)

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = payments
        fields = '__all__'
        read_only_fields = ('created_user',)
        
class GetPaymentSerializer(serializers.ModelSerializer):
    quotation = GetQuotationAndInvoice(read_only=True)
    date = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    bank=BankSerializer(read_only=True)
    created_user = CustUserSerializer(read_only=True)
    class Meta:
        model = payments
        fields = '__all__'
        
class ViewJobCardSerializer(serializers.ModelSerializer):
    factories    = serializers.SerializerMethodField()
    created_date = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    quotation = quotationSerializerForInvoice(read_only=True)
    created_user = CustUserSerializer(read_only=True)
    class Meta:
        model = jobcard
        fields = '__all__'
    
    def get_factories(self,obj):
        a = []
        b = []
        c = []
        d = []
        e = []
        factorys = quotation.objects.filter(id=obj.quotation.id).prefetch_related('quotation_door_items__set').prefetch_related('quotation_kattla_items__set').prefetch_related('quotation_cutomkattla_items__set').prefetch_related('quotation_window_items__set').prefetch_related('quotation_otherproduct_items__set').values('quotation_door_items__factory__place','quotation_kattla_items__factory__place','quotation_cutomkattla_items__factory__place','quotation_window_items__factory__place','quotation_otherproduct_items__factory__place')
        for i in factorys:
            a.append(i["quotation_cutomkattla_items__factory__place"])
            b.append(i["quotation_door_items__factory__place"])
            c.append(i["quotation_kattla_items__factory__place"])
            d.append(i["quotation_window_items__factory__place"])
            e.append(i["quotation_otherproduct_items__factory__place"])
        y = a+b+c+d+e
        listMerge = list(set(y))
        factory = [i for i in listMerge if i]
        s = ",".join(factory)
        return s
    
class ViewInvoiceSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    quotation = quotationSerializerForInvoice(read_only=True)
    created_user = CustUserSerializer(read_only=True)
    totalAmount = serializers.SerializerMethodField()
    recievedAmount = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)
    class Meta:
        model = invoice
        fields = '__all__'

    def get_totalAmount(self,obj):
        total = validatecash(obj.quotation.id)
        return total

    def get_recievedAmount(self,obj):
        total = recievedCash(obj.quotation.id)
        return total
    
class ExpenceSerializer(serializers.ModelSerializer):
    class Meta:
        model  = expences
        fields = '__all__'
        read_only_fields = ('user','created_user',)
        
class GetExpencesSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    created_user = CustUserSerializer(read_only=True)
    category  = ExpenceCategorySerializer(read_only=True)
    class Meta:
        model  = expences
        fields = '__all__'
    
class OtherProductsQuotationSeralizer(serializers.ModelSerializer):
    class Meta:
        model = other_products_item
        fields = '__all__'
        
class GetOtherProductsQuotationSeralizer(serializers.ModelSerializer):
    raw_material = RowMaterialSerializer(read_only= True)
    factory = FactorySerializer(read_only=True)
    class Meta:
        model = other_products_item
        fields = '__all__'
        
        
class IssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = issues
        fields = '__all__'
        read_only_fields = ('created_user',)
        
class GetIssueSerrializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    quotationno = quotationSerializerForInvoice(read_only = True)
    created_user = CustUserSerializer(read_only=True)
    class Meta:
        model = issues
        fields = '__all__'