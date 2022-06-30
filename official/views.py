from django.shortcuts import render

def log_in(request):
    return render (request,'official/login.html')

def dashboard(request):
    return render (request,'official/dashboard.html')

def add_user(request):
    return render (request,'official/add-user.html')

def user_accounts(request):
    return render (request, 'official/user-account.html')

def rowmaterial(request):
    return render(request, 'official/rowmaterial.html')

def joint_type(request):
    return render(request, 'official/jointtype.html')

def doors(request):
    return render(request, 'official/doors.html')

def window(request):
    return render(request, 'official/window.html')

def kattla(request):
    return render(request, 'official/kattla.html')

def custom_kattla(request):
    return render(request, 'official/custom-kattla.html')

def view_quatation(request):
    return render(request, 'official/qoutations.html')

def customer(request):
    return render(request, 'official/customer.html')

def add_qoutation(request):
    return render(request, 'official/add-quatation.html')

def gallery(request):
    return render(request, 'official/gallery.html')

def view_product_image(request):
    return render(request, 'official/view-product-image.html')

def feedback(request):
    return render(request, 'official/feedback.html')

def factory(request):
    return render(request, 'official/factory.html')

def bank(request):
    return render(request, 'official/add-bank.html')

def jobcard(request):
    return render(request, 'official/jobcard.html')

def invoice(request):
    return render(request, 'official/invoice.html')

def quotation_delete_requests(request):
    return render(request, 'official/quotation-delete-requests.html')

def factory_user(request):
    return render(request, 'official/factory-user.html')

def view_jobcard(request):
    return render(request, 'official/view-jobcard.html')

def print_quotations(request):
    return render(request, 'official/print-quotation.html')

def delivered_jobcards(request):
    return render(request, 'official/delivered-jobcards.html')

def print_invoice(request):
    return render(request, 'official/print-invoice.html')

def official_user(request):
    return render(request, 'official/admin-user.html')

def expences(request):
    return render(request, 'official/expences.html')

def others_products(request):
    return render(request, 'official/others-products.html')

def expense_category(request):
    return render(request, 'official/expence-category.html')

def income(request):
    return render(request, 'official/income.html')

def branch_details(request):
    return render(request,'official/branch-details.html')

def issues(request):
    return render(request, 'official/issues.html')

def filter_quotations(request):
    return render(request, 'official/filter-user-quotations.html')

def filter_income(request):
    return render(request, 'official/filter-salesman-income.html')

def filter_expence(request):
    return render(request, 'official/filter-salesman-expence.html')

def filter_salesman_pendingamount(request):
    return render(request, 'official/filter-salesman-pendingamount.html')