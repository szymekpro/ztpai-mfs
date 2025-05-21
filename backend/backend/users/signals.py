from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from users import tasks

User = get_user_model()

@receiver(post_save, sender=User)
def send_welcome_email(sender, instance, created, **kwargs):
    if created:
        params = {
            "first_name": instance.first_name
        }
        tasks.send_brevo_api_email.delay(instance.email, params)
