from sqlite3 import Row
from django.urls import path,include
from . import views
from . import dashboard
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

router.register('category',views.Category)
router.register('salesman',views.SalesMan)
router.register('customer',views.Customer)
router.register('rowmaterials',views.RowMaterials)
router.register('quotation',views.user_create_quotation)
router.register('joint-type',views.JointType)
router.register('doors',views.Doors)
router.register('window',views.Window)
router.register('kattla',views.Kattla)
router.register('custom-kattla',views.CustomKattla)
router.register('door-quotatation',views.CreateQuotationForDoor)
router.register('kattla-quotatation',views.CreateQuotationForKattla)
router.register('window-quotatation',views.CreateQuotationForWindow)
router.register('custom-kattla-quotatation',views.CreateQuotationForCustomKattla)
router.register('other-product-quotation',views.CreateQuotationForOtherProducts)
router.register('feedback',views.FeedBacks)
router.register('qoutation-feedback',views.QoutationFeedBacks)
router.register('jobcard',views.JobCards)
router.register('invoice',views.Invoices)
router.register('payments',views.Payments)
router.register('expences',views.Expences)

urlpatterns = [
    path('router/',(include(router.urls))),
    path('check-user/',views.CheckUser.as_view()), 
    path('get-unit-price-door/',views.GetUnitPriceOfDoor.as_view()),
    path('get-unit-price-kattla/',views.GetUnitPriceOfKattla.as_view()),
    path('get-unit-price-window/',views.GetUnitPriceOfWindow.as_view()),
    path('get-unit-price-customkattla/',views.GetUnitPriceOfCustomfKattla.as_view()),
    path('get-others-salesprice/',views.GetOtherSaleAmount.as_view()),
    path('qutation-number/',views.GetQuatationNumber.as_view()),
    path('user-permission/<str:pk>/',views.UserPermission.as_view()),  
    path('jobcard-create/',views.JobCardAndInvoice.as_view()), 
    path('jobcard-count/',dashboard.JobcardCount.as_view()),   
    path('dashboard/',dashboard.DashboardData.as_view()),
]