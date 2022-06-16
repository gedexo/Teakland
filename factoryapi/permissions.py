from rest_framework import permissions

class FactoryPemission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated or request.user.is_superuser == True:
            return True
