from django.urls import path
from . import views

urlpatterns = [
    path('',views.log_in),
    path('jobcard/',views.jobcard),
    path('view-job-card/',views.view_jobcard),
    path('print-quotation/',views.print_quotation),
    path('doors/',views.doors),
    path('window/',views.window),
    path('kattla/',views.kattla),
    path('custom-kattla/',views.custom_kattla),
    path('gallery/',views.gallery),
    path('delivered-jobcards/',views.delivered_jobcard)
]             