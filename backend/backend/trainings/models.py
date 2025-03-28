from django.db import models
from django.conf import settings
from gyms.models import Trainer, Gym
from payments.models import Payment

class ScheduledTraining(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('completed', 'Completed'),
        ('canceled', 'Canceled'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='scheduled_trainings')
    trainer = models.ForeignKey(Trainer, on_delete=models.CASCADE, related_name='trainings')
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='trainings')
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.email} with {self.trainer} at {self.start_time.strftime('%Y-%m-%d %H:%M')}"