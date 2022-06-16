from dataclasses import field
from webbrowser import get
from django.forms import model_to_dict
from rest_framework import serializers
from rest_framework.response import Response
from django.contrib.auth import get_user_model,authenticate
from . models import users
from rest_framework import status
from officialapi.models import category,door,window,kattla,row_materials,joint_type,customer,salesman,quotation,\
    quotation_door_item,quotation_kattla_item,quotation_window_item,custom_kattla,quotation_customkattla_item,factory,\
        bank,jobcard,invoice,qoutation_feedback,others,expence_category,payments
from django.db.models import Sum
from versatileimagefield.serializers import VersatileImageFieldSerializer
from userapi. jobcard_helper import validatecash, recievedCash

class AdminUser(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('id','email', 'password','phone')
        extra_kwargs = {'password': {'write_only': True}}
        read_only_fields = ('id',)

    def create(self, validated_data):
         return get_user_model().objects.create_superuser(**validated_data)
                           
class CreateUserSerailizer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('date','id','email','password','user','first_name','last_name','phone')
        extra_kwargs = {'password':{'write_only':True}}   
        read_only_fields = ('date','id',)
    def create(self, validated_data):
         return get_user_model().objects.create_user(**validated_data)
     
class CreateFactorySerailizer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('date','id','email','password','factory','first_name','last_name')
        extra_kwargs = {'password':{'write_only':True}}   
        read_only_fields = ('date','id',)
    def create(self, validated_data):
         return get_user_model().objects.create_user(**validated_data)
     
class AdminUser(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('date','id','email','password','first_name','last_name')
        extra_kwargs = {'password': {'write_only': True}}
        read_only_fields = ('id',)

    def create(self, validated_data):
         return get_user_model().objects.create_superuser(**validated_data)

class CustUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = '__all__'      
        extra_kwargs = {'password':{'write_only':True}}  
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = users
        fields = '__all__'
        
class JointTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = joint_type
        fields = '__all__'
        
class RowMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = row_materials
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
 
class CustomKattlaSerializer(serializers.ModelSerializer):
    class Meta:
        model = custom_kattla
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
        
        
class SalesMAnSerializer(serializers.ModelSerializer):
    class Meta:
        model = salesman
        fields = '__all__'
        
class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    created_by = SalesMAnSerializer(read_only = True)
    dealt_by = SalesMAnSerializer(read_only = True)
    quotationCount = serializers.SerializerMethodField()
    class Meta:
        model = customer
        fields = '__all__'
    def get_quotationCount(self,obj):
        return quotation.objects.filter(customer=obj).count()
        
class ViewQoutationSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    user = UserSerializer(read_only=True)
    customer = CustomerSerializer(read_only = True)
    doorsubtotal = serializers.SerializerMethodField()
    kattlasubtotal = serializers.SerializerMethodField()
    windowsubtotal = serializers.SerializerMethodField()
    customkattlasubtotal = serializers.SerializerMethodField()
    othersubtotal = serializers.SerializerMethodField()
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
            
class DoorQoutationSerializer(serializers.ModelSerializer):
    raw_material = RowMaterialSerializer(read_only = True)
    image = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    class Meta:
        model = quotation_door_item
        fields = '__all__'
        
class WindowQoutationSerializer(serializers.ModelSerializer):
    raw_material = RowMaterialSerializer(read_only = True)
    image = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    class Meta:
        model = quotation_window_item
        fields = '__all__'
        
class KattlaQoutationSerializer(serializers.ModelSerializer):
    raw_material = RowMaterialSerializer(read_only = True)
    image = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    class Meta:
        model = quotation_kattla_item
        fields = '__all__'
        

class GetQuatationCustomKattlaSerializer(serializers.ModelSerializer):
    raw_material = RowMaterialSerializer(read_only= True)
    image = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__300x400')
        ]
    )
    class Meta:
        model = quotation_customkattla_item
        fields = '__all__' 
        
        
class GalleryDoorSerializer(serializers.ModelSerializer):
    rowmaterial = RowMaterialSerializer()
    joint = JointTypeSerializer()
    image_one = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__220x220')
        ]
    )
    image_two = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__220x220')
        ]
    )
    image_three = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__220x220')
        ]
    )
    class Meta:
        model = door
        fields = '__all__'
        
class GalleryKattlaSerializer(serializers.ModelSerializer):
    rowmaterial = RowMaterialSerializer()
    image_one = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__220x220')
        ]
    )
    image_two = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__220x220')
        ]
    )
    image_three = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__220x220')
        ]
    )
    class Meta:
        model = kattla
        fields = '__all__'
        
class GalleryWindowSerializer(serializers.ModelSerializer):
    rowmaterial = RowMaterialSerializer()
    image_one = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__220x220')
        ]
    )
    image_two = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__220x220')
        ]
    )
    image_three = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__220x220')
        ]
    )
    class Meta:
        model = window
        fields = '__all__'

class GalleryCustomKattlaSerializer(serializers.ModelSerializer):
    rowmaterial = RowMaterialSerializer()
    image_one = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__220x220')
        ]
    )
    image_two = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__220x220')
        ]
    )
    image_three = VersatileImageFieldSerializer(
        sizes=[
            ('medium_square_crop', 'crop__220x220')
        ]
    )
    class Meta:
        model = custom_kattla
        fields = '__all__'
        
class FactorySerializer(serializers.ModelSerializer):
    class Meta:
        model = factory
        fields = '__all__'
        
class UpdateJobCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = jobcard
        fields = '__all__'

class BankSerializer(serializers.ModelSerializer):
    class Meta:
        model = bank
        fields = '__all__'

class CreateQuotationSerializer(serializers.ModelSerializer):
    class Meta:
        model = quotation
        fields = '__all__'
        read_only_fields = ('quoation_number',)
        
class FilterQoutationSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    user = UserSerializer(read_only=True)
    customer = CustomerSerializer(read_only = True)
    jobcard = serializers.SerializerMethodField()
    invoice = serializers.SerializerMethodField()
    created_by = CustUserSerializer(read_only = True)
    totalAmount = serializers.SerializerMethodField()
    recievedAmount = serializers.SerializerMethodField()
    
    class Meta:
        model = quotation
        fields = '__all__'
        
    def get_jobcard(self,obj):
        if jobcard.objects.filter(quotation=obj).exists():
            jobcardno = jobcard.objects.get(quotation=obj)
            return model_to_dict(jobcardno)
        else:
            return False

    def get_invoice(self,obj):
        if invoice.objects.filter(quotation=obj).exists():
            invoiceno = invoice.objects.get(quotation=obj)
            return model_to_dict(invoiceno)
        else:
            return False
            
    def get_totalAmount(self,obj):
        total = validatecash(obj.id)
        return total

    def get_recievedAmount(self,obj):
        total = recievedCash(obj.id)
        return total
    
class OtherProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = others
        fields = '__all__'
        
class GetOtherProductSerializer(serializers.ModelSerializer):
    rowmaterial = RowMaterialSerializer(read_only=True)
    class Meta:
        model = others
        fields = '__all__' 
        
class ExpenceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = expence_category
        fields = '__all__'
        
class PaymentSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    quotation = FilterQoutationSerializer(read_only=True)
    created_user = CustUserSerializer(read_only=True)
    class Meta:
        model = payments
        fields = '__all__'