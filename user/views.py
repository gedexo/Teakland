from django.shortcuts import render
# Create your views here.

def log_in(request):
    return render(request, 'user/login.html')

def dashboard(request):
    return render(request, 'user/index.html')

def category(request):
    return render(request, 'user/category.html')

def products(request):
    return render(request, 'user/products.html')

def product_features(request):
    return render(request, 'user/productextrafeatures.html')

def salesman(request):
    return render(request, 'user/salesman.html')

def customer(request):
    return render(request, 'user/customer.html')

def rowmaterial(request):
    return render(request, 'user/rowmaterial.html')

def joint_type(request):
    return render(request, 'user/jointtype.html')

def doors(request):
    return render(request, 'user/doors.html')

def window(request):
    return render(request, 'user/window.html')

def kattla(request):
    return render(request, 'user/kattla.html')

def custom_kattla(request):
    return render(request, 'user/custom-kattla.html')

def view_quatation(request):
    return render(request, 'user/quotation.html')

def add_quatation(request):
    return render(request, 'user/add-quatation.html')

def user_jobcard(request):
    return render(request, 'user/jobcard.html')

def quotation_print(request):
    return render(request, 'user/print-quotation.html')

def gallery(request):
    return render(request, 'user/gallery.html')

def jobcard(request):
    return render(request, 'user/jobcard.html')

def invoice(request):
    return render(request, 'user/invoice.html')

def view_jobcard(request):
    return render(request, 'user/view-jobcard.html')

def delivered_jobcards(request):
    return render(request, 'user/delivered-jobcards.html')

def print_invoice(request):
    return render(request, 'user/print-invoice.html')

def expences(request):
    return render(request, 'user/expences.html')

def others_products(request):
    return render(request, 'user/others-product.html')

def jobcard_create(request):
    return render(request,'user/jobcard-create.html')

def income(request):
    return render(request, 'user/income.html')