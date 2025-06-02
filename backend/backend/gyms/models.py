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

    class Meta:
        indexes = [
            models.Index(fields=['city']),
            models.Index(fields=['name']),
        ]


class TrainerService(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)

    def __str__(self):
        return self.name

    class Meta:
        indexes = [
            models.Index(fields=['price']),
            models.Index(fields=['name']),
        ]

class Trainer(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    gym = models.ForeignKey(Gym, on_delete=models.CASCADE, related_name='trainers')
    description = models.TextField(blank=True, max_length=50, default="no description")
    bio = models.TextField(blank=True, default="no bio")
    available_services = models.ManyToManyField(TrainerService, related_name="trainers")
    photo = models.ImageField(upload_to='', default='trainer_blank_3-1.jpg', blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.gym.name})"

    @property
    def full_name(self):
        return f"{self.last_name} {self.first_name}"

    class Meta:
        indexes = [
            models.Index(fields=['gym']),
        ]


