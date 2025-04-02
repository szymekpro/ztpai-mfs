from django.contrib import admin
from .models import UserMembership, MembershipType

# Register your models here.
admin.site.register([UserMembership, MembershipType])