from celery import shared_task
import requests
from backend import settings
from backend.settings import BREVO_API_KEY
import os
import logging

@shared_task
def send_brevo_api_email(to_email, params):

    template_id = 1
    url = "https://api.brevo.com/v3/smtp/email"

    headers = {
        "accept": "application/json",
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
    }

    payload = {
        "sender": {"email": settings.DEFAULT_FROM_EMAIL},
        "to": [{"email": to_email}],
        "templateId": template_id,
        "params": params,
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 201:
        print(f"E-mail sent to {to_email}")
    else:
        print(f" E-mail fault {to_email}: {response.text}")