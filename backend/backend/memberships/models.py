from django.db import models
from django.conf import settings

class MembershipType(models.Model):
    name = models.CharField(max_length=100)
    duration_days = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    description = models.TextField(blank=True)
    photo_path = models.ImageField(default='mtype-standard.png', blank=True)

    def __str__(self):
        return f"{self.name} ({self.duration_days} dni) – {self.price} zł"


class UserMembership(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='memberships')
    membership_type = models.ForeignKey(MembershipType, on_delete=models.PROTECT, related_name='user_memberships')
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.email} – {self.membership_type.name} ({self.start_date} → {self.end_date})"
