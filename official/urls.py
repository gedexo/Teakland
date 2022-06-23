from django.urls import path
from . import views

urlpatterns = [
    path('',views.log_in),
    path('dashboard/',views.dashboard),
    path('add-user/',views.add_user),
    path('user-account/',views.user_accounts),
    path('rowmaterial/',views.rowmaterial),
    path('joint-type/',views.joint_type),
    path('doors/',views.doors),
    path('window/',views.window),
    path('kattila/',views.kattla),
    path('custom-kattla/',views.custom_kattla),
    path('quotations/',views.view_quatation),
    path('customer/',views.customer),
    path('add-quotation/',views.add_qoutation),
    path('gallery/',views.gallery),
    path('product-gallery/',views.view_product_image),
    path('feedback/',views.feedback),
    path('factory/',views.factory),
    path('bank/',views.bank),
    path('jobcard/',views.jobcard),
    path('invoice/',views.invoice),
    path('quotation-delete-requests/',views.quotation_delete_requests),
    path('factory-account/',views.factory_user),
    path('view-job-card/',views.view_jobcard),
    path('print-quotation/',views.print_quotations),
    path('delivered-jobcards/',views.delivered_jobcards),
    path('print-invoice/',views.print_invoice),
    path('official-users/',views.official_user),
    path('expence/',views.expences),
    path('others/',views.others_products),
    path('expense-category/',views.expense_category),
    path('income/',views.income),
    path('branch-details/',views.branch_details)
]