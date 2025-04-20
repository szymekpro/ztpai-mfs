from django.db import models
from django.conf import settings

class Gym(models.Model):
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    address = models.TextField()
    description = models.TextField(blank=True, null=True)
    photo = models.ImageField(default='gym-standard.png', blank=True)

    def __str__(self):
        return f"{self.name} ({self.city})"


class Trainer(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='trainers')
    bio = models.TextField(blank=True)
    photo = models.ImageField(default='trainer-standard.png', blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.gym.name})"

    @property
    def full_name(self):
        return f"{self.last_name} {self.first_name}"


class TrainerAvailability(models.Model):
    trainer = models.ForeignKey(Trainer, on_delete=models.CASCADE, related_name='availabilities')

    WEEKDAYS = [
        ('Monday', 'Monday'),
        ('Tuesday', 'Tuesday'),
        ('Wednesday', 'Wednesday'),
        ('Thursday', 'Thursday'),
        ('Friday', 'Friday'),
        ('Saturday', 'Saturday'),
        ('Sunday', 'Sunday'),
    ]

    weekday = models.CharField(max_length=10, choices=WEEKDAYS)
    start_time = models.TimeField()
    end_time = models.TimeField()

    def __str__(self):
        return f"{self.trainer} - {self.weekday} {self.start_time}-{self.end_time}"
