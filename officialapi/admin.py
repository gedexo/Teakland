from django.contrib import admin

# Register your models here.
from .models import others, users,User,jobcard

admin.site.register(users)
admin.site.register(others)
admin.site.register(jobcard)
