from rest_framework import permissions


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
