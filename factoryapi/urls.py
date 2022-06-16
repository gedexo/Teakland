from django.urls import path,include
from . import views
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

router.register('jobcard',views.JobCards)
router.register('quotation',views.Quotations)
router.register('delivered-jobcard',views.DeliveredJobCards)

urlpatterns = [
    path('router/',include(router.urls)),
    path('check-user/',views.CheckUser.as_view()),
    path('count-objects/',views.CountObjects.as_view()),
    path('check-jobcard/<int:pk>/',views.CheckJobCard.as_view())
]
