from django.urls import path,include
from rest_framework_simplejwt import views as jwt_views
from . import views
from . import dashboard
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

router.register('users',views.UserView),
router.register('user-login-details',views.GetUsersLoginDetails)
router.register('factory-login-details',views.GetFactoryLoginDetails)
router.register('rowmaterials',views.RowMaterials)
router.register('joint-type',views.JointType)
router.register('doors',views.Doors)
router.register('window',views.Window)
router.register('kattla',views.Kattla)
router.register('other-products',views.OthersProducts)
router.register('custom-kattla',views.CustomKattla)
router.register('customer',views.ViewCustomer)
router.register('qoutations',views.Quotations)
router.register('door-quotatation',views.CreateQuotationForDoor)
router.register('kattla-quotatation',views.CreateQuotationForKattla)
router.register('window-quotatation',views.CreateQuotationForWindow)
router.register('custom-kattla-quotatation',views.CreateQuotationForCustomKattla)
router.register('door-gallery',views.DoorGallery)
router.register('kattla-gallery',views.KattlaGallery)
router.register('window-gallery',views.WindowGallery)
router.register('custom-kattla-gallery',views.CustomKattlaGallery)
router.register('factory',views.Factory)
router.register('bank',views.Banks)
router.register('jobcard',views.JobCards)
router.register('invoice',views.Invoices)
router.register('expence-category',views.ExpenceCategory)
router.register('income',views.Income)

urlpatterns = [
    path('router/',include(router.urls)),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('create-official-user/',views.CreateAdminUserView.as_view()),
    path('check-user/',views.CheckUser.as_view()),
    path('update-user/<int:pk>/<str:category>/',views.UpdateUser.as_view()),
    path('create-user-acccount/',views.CreateUserCredentials.as_view()),
    path('create-official-user-acccount/',views.CreateOfficialUser.as_view()),
    path('user-permission/',views.UserPermission.as_view()),
    path('image-gallery/<str:pk>/<str:category>/',views.ViewProductGallery.as_view()),
    path('count/',views.CountObjects.as_view()),
    path('dashboard/',dashboard.DashboardData.as_view()),
    path('dashboard-jobcard-count/',dashboard.DashboardJobcardCount.as_view()),
    path('get-login-user/',views.GetUser.as_view()),
    path('logout/',views.Logout.as_view()),
    path('customer-count/',views.CustomerCounts.as_view()),
    path('filter-customer-data/<str:pk>/',views.FilterCustomersData.as_view()),
    path('get-branch-details/',views.GetBranchQuotationDetails.as_view()),
    path('check-passowrd/',views.CheckPassword.as_view()),
    # path('date-based-filter/',views.GetBranchQuotationDetailsDividedByDate.as_view()),
]
