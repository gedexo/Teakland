from math import perm
from rest_framework import permissions


class ProductGalleryPermission(permissions.BasePermission):

    edit_methods = ('get','list','retrieve')

    def has_permission(self, request, view):
        if request.user.is_authenticated or request.user.is_superuser:
            return True

class FactoryPermission(permissions.BasePermission):
     def has_permission(self, request, view):
        if request.user.is_authenticated or request.user.is_superuser:
            return True
    
class BankPermission(permissions.BasePermission):
     def has_permission(self, request, view):
        if request.method in ['POST']  or request.method in ['DELETE']:
            if request.user.is_superuser:
                return True
        else:
            if request.user.is_authenticated or request.user.is_superuser:
                return True
            
class BasicUserPermission(permissions.BasePermission):
     def has_permission(self, request, view):
        if request.user.is_authenticated or request.user.is_superuser:
            return True

class OthersProductPermission(permissions.BasePermission):
      def has_permission(self, request, view):
        print('#'*10)
        if request.method in ['POST']  or request.method in ['DELETE'] or request.method in['UPDATE']:
            if request.user.is_superuser:
                return True
        else:
            if request.user.is_authenticated or request.user.is_superuser:
                return True
            

        
