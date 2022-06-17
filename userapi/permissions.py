from rest_framework import permissions
from officialapi.models import quotation

class FeedBackPermission(permissions.BasePermission):
    edit_methods = ('get','list','retrieve','update','patch','delete')

    def has_permission(self, request, view):
        if request.user.is_authenticated or request.user.is_superuser:
            return True

class JobCardPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated or request.user.is_superuser:
            return True
        
class BasicUserPermission(permissions.BasePermission):
     def has_permission(self, request, view):
        if request.user.is_authenticated or request.user.is_superuser:
            return True

class QuotationPermissions(permissions.BasePermission):
    def has_permission(self,request,view):
        if request.user.is_authenticated or request.user.is_superuser:
            return True 
        
    def has_object_permission(self, request, view, obj):
        print('*'*10,request.method)
        if request.method in ['POST'] or request.method in ['DELETE'] or request.method in['PUT'] or request.method in['PATCH']:
            if request.user.is_superuser == True:
                return True
            else:
                if obj.quotation.created_by == request.user:
                    return True
        else:
            return True
        