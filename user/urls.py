from django.urls import path,include
from . import views

urlpatterns= [
    path('',views.log_in),
    path('dashboard/',views.dashboard),
    path('category/',views.category),
    path('products/',views.products),
    path('add-features/',views.product_features),
    path('salesman/',views.salesman),
    path('customer/',views.customer),
    path('rowmaterial/',views.rowmaterial),
    path('joint-type/',views.joint_type),
    path('doors/',views.doors),
    path('window/',views.window),
    path('kattila/',views.kattla),
    path('custom-kattila/',views.custom_kattla),
    path('quotations/',views.view_quatation),
    path('add-quatation/',views.add_quatation),
    path('user-jobcard/',views.user_jobcard),
    path('print-quotation/',views.quotation_print),
    path('gallery/',views.gallery),
    path('jobcard/',views.jobcard),
    path('jobcard-create/',views.jobcard_create),
    path('invoice/',views.invoice),
    path('view-job-card/',views.view_jobcard),
    path('delivered-jobcards/',views.delivered_jobcards),
    path('print-invoice/',views.print_invoice),
    path('expences/',views.expences),
    path('others/',views.others_products),
    path('income/',views.income)
]