

from enum import unique
from statistics import mode
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from versatileimagefield.fields import VersatileImageField, PPOIField
from phone_field import PhoneField
# Create your models here.

class users(models.Model):
    date        = models.DateField(auto_now_add=True)
    name        = models.CharField(max_length=100)
    place       = models.CharField(max_length=100)
    phonenumber = PhoneField(null=True,blank=True)
    email       = models.EmailField(unique=True)
    branch_key  = models.CharField(max_length=20,null=True)
    address     = models.TextField(max_length=250)

class factory(models.Model):
    date      =models.DateField(auto_now_add=True,null=True)
    place     = models.CharField(max_length=100)
    address   = models.TextField()
    contactno = PhoneField()
    
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        """Create Save a User"""
        if not email:
            raise ValueError('User must have a Email')
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        if user:
            return user

    def create_superuser(self, email, password,**extra_fields):
        """Create and Save a super User"""
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user
        
class User(AbstractBaseUser, PermissionsMixin):
    """"Custom Model"""
    date       = models.DateField(auto_now_add=True,null=True)
    email      = models.EmailField(max_length=225, unique=True)
    first_name = models.CharField(max_length=225)
    last_name  = models.CharField(max_length=100,null=True,blank=True)
    is_active  = models.BooleanField(default=True)
    is_staff   = models.BooleanField(default=False)
    phone      = PhoneField(unique=False,null=True,blank=True)
    user       = models.ForeignKey(users, on_delete = models.CASCADE,null=True,blank=True)
    factory    = models.ForeignKey(factory, on_delete = models.CASCADE,null=True,blank=True)
    objects    = UserManager()
    USERNAME_FIELD = 'email'

    def __str__(self):
        return str(self.email)
    
class category(models.Model):
    date = models.DateField(auto_now_add=True,null=True)
    name = models.CharField(max_length=150)
    user = models.ForeignKey(users,on_delete=models.CASCADE)
    class Meta:
        unique_together = ('name','user')
       
class salesman(models.Model):
    date    = models.DateField(auto_now_add=True)
    user    = models.ForeignKey(users,on_delete=models.CASCADE)
    name    = models.CharField(max_length=150)
    place   = models.CharField(max_length=150,null=True,blank=True)
    email   = models.EmailField()
    phone   = PhoneField()
    address = models.TextField()
    class Meta:
        unique_together = ('user','name','phone')
        
class customer(models.Model):
    date        = models.DateField(auto_now_add=True)
    user        = models.ForeignKey(users,on_delete=models.CASCADE)
    created_by  = models.ForeignKey(salesman,on_delete=models.CASCADE,related_name='created_by')
    dealt_by    = models.ForeignKey(salesman,on_delete=models.CASCADE,related_name='dealt_by')
    name        = models.CharField(max_length=150)
    contact_no  = PhoneField()
    type        = models.CharField(null=True,blank=True,max_length=70)
    source      = models.CharField(null=True,blank=True,max_length=70)
    address     = models.TextField()
    remark      = models.TextField(null=True)
    is_enquiry  = models.BooleanField(default=False)

class feedback(models.Model):
    date           = models.DateField(auto_now_add = True)
    deleted_user   = models.ForeignKey(User,on_delete=models.CASCADE)
    feedback       = models.TextField()
    customername   = models.CharField(max_length=100)
    user           =  models.ForeignKey(users,on_delete=models.CASCADE)
    customernumber = PhoneField()
    is_seen        = models.BooleanField(default=False)

class row_materials(models.Model):
    date = models.DateField(auto_now_add=True,null=True)
    name = models.CharField(max_length=200)
    
    class Meta:
        unique_together = ('name',)

class quotation(models.Model):
    STATUS_CHOICES = (('open','open'),('onprocess','onprocess'),('pending','pending'),('completed','completed'),('partiallycompleted', 'partiallycompleted'),('delivered','delivered'))
    quoation_number=models.CharField(max_length=100,unique=True)
    customer       = models.ForeignKey(customer,on_delete=models.PROTECT)
    date           = models.DateTimeField(auto_now=True,)
    user           = models.ForeignKey(users,on_delete=models.PROTECT)
    status         = models.CharField(choices=STATUS_CHOICES,max_length=100,default='open')
    created_by     = models.ForeignKey(User,related_name='quotations',on_delete = models.PROTECT,null=True,blank=True)
    tax            = models.FloatField(null=True,blank=True)
    remark         = models.TextField(null=True)
    is_seen        = models.BooleanField(default=False)
    class Meta:
       ordering = ['status']
       
class joint_type(models.Model):
    date       = models.DateField(auto_now_add=True,null=True)
    joint_type = models.CharField(max_length=100)
    code       = models.CharField(max_length=100)
    
    class Meta:
        unique_together = ('joint_type','code')

class qoutation_feedback(models.Model):
    date             = models.DateField(auto_now=True,null=True)
    qoutation_number = models.ForeignKey(quotation,on_delete=models.CASCADE,null=True)
    user             = models.ForeignKey(users,on_delete=models.CASCADE)
    feedback         = models.TextField()
    is_seen          = models.BooleanField(default=False)
    
class door(models.Model):
    date          = models.DateField(auto_now_add=True)
    rowmaterial   = models.ForeignKey(row_materials,on_delete=models.PROTECT)
    doortype      = models.CharField(max_length=100)
    joint         = models.ForeignKey(joint_type,on_delete=models.PROTECT)
    labour_charge = models.BigIntegerField()
    factory_price = models.FloatField(default=0,)
    price         = models.FloatField()
    image_one     = VersatileImageField(upload_to = 'doorimages',ppoi_field='image_ppoi',blank =True)
    image_two     = VersatileImageField(upload_to = 'doorimages',ppoi_field='image_ppoi',blank =True)
    image_three   = VersatileImageField(upload_to = 'doorimages',ppoi_field='image_ppoi',blank =True)
    image_ppoi    = PPOIField()
    
    class Meta:
        unique_together = ('rowmaterial','doortype','joint')

class window(models.Model):
    date          = models.DateField(auto_now_add=True)
    rowmaterial   = models.ForeignKey(row_materials,on_delete=models.PROTECT)
    box           = models.IntegerField(null=True,blank=True)
    labour_charge = models.BigIntegerField()
    price         = models.FloatField()
    factory_price = models.FloatField(default=0)
    shutter       = models.BooleanField(default=False)
    design        = models.BooleanField(default=False)
    image_one     = VersatileImageField(upload_to = 'windowimgage',ppoi_field='image_ppoi',blank =True)
    image_two     = VersatileImageField(upload_to = 'windowimgage',ppoi_field='image_ppoi',blank =True)
    image_three   = VersatileImageField(upload_to = 'windowimgage',ppoi_field='image_ppoi',blank =True)
    image_ppoi    = PPOIField()
    
    class Meta:
        unique_together = ('rowmaterial','box','shutter','labour_charge','design')


class kattla(models.Model):
    date          = models.DateField(auto_now_add=True)
    rowmaterial   = models.ForeignKey(row_materials,on_delete=models.PROTECT)
    kattlatype    = models.CharField(max_length=60)
    open_closed   = models.BooleanField(default=False)#closed return true, open return false 
    price         = models.FloatField()
    factory_price = models.FloatField(default=0)
    noofboxes     = models.BigIntegerField()
    labour_charge = models.BigIntegerField(null=True,blank=True,default=0) 
    image_one     = VersatileImageField(upload_to = 'kattlaimages',ppoi_field='image_ppoi',blank =True)
    image_two     = VersatileImageField(upload_to = 'kattlaimages',ppoi_field='image_ppoi',blank =True)
    image_three   = VersatileImageField(upload_to = 'kattlaimages',ppoi_field='image_ppoi',blank =True)
    image_ppoi    = PPOIField()    
    class Meta:
        unique_together = ('rowmaterial','kattlatype',)

class custom_kattla(models.Model):
    date          = models.DateField(auto_now_add=True)
    rowmaterial   = models.ForeignKey(row_materials,on_delete=models.PROTECT)
    price         = models.FloatField()
    factory_price = models.FloatField(default=0)
    labour_charge = models.BigIntegerField(null=True,blank=True,default=0) 
    image_one     = VersatileImageField(upload_to = 'customkattlaimages',ppoi_field='image_ppoi',blank =True)
    image_two     = VersatileImageField(upload_to = 'customkattlaimages',ppoi_field='image_ppoi',blank =True)
    image_three   = VersatileImageField(upload_to = 'customkattlaimages',ppoi_field='image_ppoi',blank =True)
    image_ppoi    = PPOIField()    
    class Meta:
        unique_together = ('rowmaterial',)
        
class others(models.Model):
    date        = models.DateField(auto_now_add=True)
    name        = models.CharField(null=False,max_length=100)
    rowmaterial = models.ForeignKey(row_materials,on_delete=models.PROTECT)
    price_cost  = models.BigIntegerField(null=True)
    sales_rate  = models.BigIntegerField()
    
    class Meta:
        unique_together = ('rowmaterial','name',)
    
class quotation_door_item(models.Model):
    quotation          = models.ForeignKey(quotation,related_name='quotation_door_items',on_delete=models.CASCADE)
    name               = models.CharField(max_length=100) #Door 150 x 140
    factory            = models.ForeignKey(factory,on_delete=models.PROTECT,null=True)
    type               = models.CharField(max_length=100,default='Single')
    raw_material       = models.ForeignKey(row_materials,related_name='quotation_door_items',on_delete=models.PROTECT)
    labour_charge      = models.BigIntegerField()
    joint              = models.CharField(max_length=60)
    unit_amount        = models.FloatField()
    factory_unitamount = models.FloatField(default=0,null=True,blank=True)
    quantity           = models.IntegerField()
    dimention_height   = models.FloatField()
    dimention_width    = models.FloatField()
    squarfeet          = models.FloatField()
    aggregate          = models.FloatField()
    status             = models.CharField(max_length=20, default='open') 
    remark             = models.TextField(null=True,blank=True)
    image              = VersatileImageField(upload_to = 'quotationdoorimage',ppoi_field='image_ppoi',blank =True)
    image_ppoi         = PPOIField() 

class quotation_kattla_item(models.Model):
    quotation          = models.ForeignKey(quotation,related_name='quotation_kattla_items',on_delete=models.CASCADE)
    name               = models.CharField(max_length=100) # <Type> Kattla <thikness>  Example W2 Kattla 4x3 
    factory            = models.ForeignKey(factory,on_delete=models.PROTECT,null=True)
    type               = models.CharField(max_length=100,default='Door Open')   # W1 ,W2 Door closed etc.
    dimention_height   = models.FloatField()
    dimention_width    = models.FloatField()
    raw_material       = models.ForeignKey(row_materials,related_name='quotation_kattla_items',on_delete=models.PROTECT)
    unit_amount        = models.FloatField()
    factory_unitamount = models.FloatField(default=0,null=True,blank=True)
    quantity           = models.IntegerField()
    qubic              = models.FloatField()
    thickness_x        = models.FloatField(null=True)
    thickness_y        = models.FloatField(null=True)
    aggregate          = models.FloatField()
    status             = models.CharField(max_length=20, default='open') 
    remark             = models.TextField(null=True,blank=True)  
    image              = VersatileImageField(upload_to = 'quotationkattlaimage',ppoi_field='image_ppoi',blank =True)
    image_ppoi         = PPOIField() 
      
class quotation_customkattla_item(models.Model):
    quotation          = models.ForeignKey(quotation,related_name='quotation_cutomkattla_items',on_delete=models.CASCADE)
    name               = models.CharField(max_length=100) # <Type> Kattla <thikness>  Example W2 Kattla 4x3 
    factory            = models.ForeignKey(factory,on_delete=models.PROTECT,null=True)
    raw_material       = models.ForeignKey(row_materials,related_name='quotation_customkattla_items',on_delete=models.PROTECT)
    unit_amount        = models.FloatField()
    factory_unitamount = models.FloatField(default=0,null=True,blank=True)
    length             = models.FloatField(null=True,blank=True)
    quantity           = models.IntegerField()
    qubic              = models.FloatField()
    labour_charge      = models.FloatField(null=True,default=0)
    thickness_x        = models.FloatField(null=True)
    thickness_y        = models.FloatField(null=True)
    aggregate          = models.FloatField()
    status             = models.CharField(max_length=20, default='open') 
    remark             = models.TextField(null=True,blank=True)  
    image              = VersatileImageField(upload_to = 'quotationcustomkattlaimage',ppoi_field='image_ppoi',blank =True)
    image_ppoi         = PPOIField() 
      
class quotation_window_item(models.Model):
    quotation          = models.ForeignKey(quotation,related_name='quotation_window_items',on_delete=models.CASCADE)
    name               = models.CharField(max_length=100) #Window 4 x 3
    factory            = models.ForeignKey(factory,on_delete=models.PROTECT,null=True)
    box                = models.IntegerField()
    raw_material       = models.ForeignKey(row_materials,related_name='quotation_window_items',on_delete=models.PROTECT)
    labour_charge      = models.BigIntegerField()
    unit_amount        = models.FloatField()
    factory_unitamount = models.FloatField(default=0,null=True,blank=True)
    shutter            = models.BooleanField(default=False)
    design             = models.BooleanField(default=False)
    quantity           = models.IntegerField()
    dimention_height   = models.FloatField()
    dimention_width    = models.FloatField()
    squarfeet          = models.FloatField()
    aggregate          = models.FloatField()
    status             = models.CharField(max_length=20, default='open') 
    remark             = models.TextField(null=True,blank=True)  
    image              = VersatileImageField(upload_to = 'quotationwindowimage',ppoi_field='image_ppoi',blank =True)
    image_ppoi         = PPOIField() 
        
class other_products_item(models.Model):
    quotation        = models.ForeignKey(quotation,related_name='quotation_otherproduct_items',on_delete=models.CASCADE)
    raw_material     = models.ForeignKey(row_materials,related_name='quotation_otherproduct_items',on_delete=models.PROTECT)
    name             = models.CharField(null=True,max_length=150)
    factory          = models.ForeignKey(factory,on_delete=models.PROTECT,null=True)
    type             = models.CharField(null=True,max_length=150)
    status           = models.CharField(max_length=20, default='open') 
    remark           = models.TextField(null=True,blank=True)  
    price            = models.BigIntegerField()
    quantity         = models.IntegerField()
    aggregate        = models.BigIntegerField()

class invoice(models.Model):
    date          = models.DateTimeField(auto_now_add=True)
    invoiceno     = models.CharField(max_length=1000,unique=True)
    quotation     = models.OneToOneField(quotation,on_delete=models.PROTECT)
    created_user  = models.ForeignKey(User, on_delete=models.PROTECT)
    user          = models.ForeignKey(users,on_delete=models.PROTECT)

class jobcard(models.Model):
    STATUS_CHOICES = (('open','open'),('onprocess','onprocess'),('pending','pending'),('completed','completed'),('partiallycompleted', 'partiallycompleted'),('delivered','delivered'))
    created_date         = models.DateTimeField(null=True)
    jobcardno            = models.CharField(max_length=1000,unique=True)
    factory              = models.ForeignKey(factory,on_delete=models.PROTECT,null=True)
    quotation            = models.OneToOneField(quotation,on_delete=models.PROTECT)
    expected_delivery    = models.DateField(null=True,blank=True)
    created_user         = models.ForeignKey(User, on_delete=models.PROTECT)
    user                 = models.ForeignKey(users,on_delete=models.PROTECT)
    status               = models.CharField(choices=STATUS_CHOICES,default='open',max_length=50)
    completed_date       = models.DateField(null=True)
    is_seen              = models.BooleanField(default=False)
    estimation_amount    = models.FloatField(null=True,blank=True)
    delivered_user       = models.ForeignKey(User, on_delete=models.PROTECT,null=True,blank=True,related_name='deleivered_user')
    
class bank(models.Model):
    date      = models.DateField(auto_now=True)
    name      = models.CharField(max_length=70)
    ifsccode  = models.CharField(max_length=50)
    accountno = models.CharField(max_length=20)

class payments(models.Model):
    PAYMENT_CHOICES    = (('cash','cash'),('bank','bank'))
    date               = models.DateTimeField(auto_now=True)
    quotation          = models.ForeignKey(quotation,on_delete=models.PROTECT)
    type               = models.CharField(max_length=20,choices=PAYMENT_CHOICES)
    amount             = models.BigIntegerField()
    bank               = models.ForeignKey(bank,on_delete=models.PROTECT,null=True,blank=True)
    created_user       = models.ForeignKey(User,on_delete=models.PROTECT,null=False)
 
class expence_category(models.Model):
    category = models.CharField(max_length=100)   
 
class expences(models.Model):
    date        = models.DateField(auto_now_add=True)
    category    = models.ForeignKey(expence_category,on_delete=models.PROTECT,null=True)
    description = models.TextField()
    user        = models.ForeignKey(users, on_delete=models.CASCADE)
    created_user= models.ForeignKey(User, on_delete=models.CASCADE)
    amount      = models.BigIntegerField()
