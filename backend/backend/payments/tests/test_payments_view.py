import os
from decimal import Decimal
from django.contrib.contenttypes.models import ContentType

# Ustawiamy ścieżkę do settings Django przed inicjalizacją
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'
import django  # type: ignore
django.setup()

from ..models import Payment
from memberships.models import UserMembership, MembershipType
from django.contrib.auth import get_user_model

import io
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile

import pytest
from rest_framework.test import APIClient
import tempfile
from django.test.utils import override_settings


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture(autouse=True, scope='function')
def use_temp_media_root():
    with tempfile.TemporaryDirectory() as tmpdirname:
        with override_settings(MEDIA_ROOT=tmpdirname):
            yield


@pytest.fixture
def test_user():
    User = get_user_model()
    return User.objects.create_user(
        email='testuser@gmail.com',
        password='123',
        role='member'
    )


@pytest.fixture
def member_user():
    User = get_user_model()
    return User.objects.create_user(
        email='member@gym.pl',
        password='mem123',
        role='member'
    )


@pytest.fixture
def admin_user():
    User = get_user_model()
    return User.objects.create_user(
        email='admin@gym.pl',
        password='admin123',
        role='admin'
    )


@pytest.fixture
def employee_user():
    User = get_user_model()
    return User.objects.create_user(
        email='employee@gym.pl',
        password='emp123',
        role='employee'
    )


def generate_dummy_image(name="standard.jpg", format="JPEG"):
    image = Image.new("RGB", (100, 100), color="blue")
    image_io = io.BytesIO()
    image.save(image_io, format=format)
    image_io.seek(0)

    return SimpleUploadedFile(
        name=name,
        content=image_io.read(),
        content_type=f"image/{format.lower()}"
    )


@pytest.fixture
def sample_membership_type():
    mock_image = generate_dummy_image()

    return MembershipType.objects.create(
        name="Standard",
        duration_days=30,
        price=Decimal("99.99"),
        description="Basic gym access",
        photo=mock_image
    )


@pytest.fixture
def sample_user_membership(test_user, sample_membership_type):
    return UserMembership.objects.create(
        user=test_user,
        membership_type=sample_membership_type,
        start_date="2024-01-01",
        end_date="2024-01-31",
        is_active=True
    )


@pytest.fixture
def generic_payment(member_user, sample_user_membership):
    content_type = ContentType.objects.get_for_model(sample_user_membership)
    return Payment.objects.create(
        user=member_user,
        amount=Decimal("59.99"),
        status="pending",
        description="Test payment with GFK",
        content_type=content_type,
        object_id=sample_user_membership.id,
    )


def authenticated_client_for_user(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.mark.django_db
def test_list_payments_as_admin(api_client, admin_user, generic_payment):
    client = authenticated_client_for_user(api_client, admin_user)
    response = client.get("/api/payments/")
    assert response.status_code == 200
    assert any(item["id"] == generic_payment.id for item in response.data)


@pytest.mark.django_db
def test_list_payments_as_member(api_client, member_user, generic_payment):
    client = authenticated_client_for_user(api_client, member_user)
    response = client.get("/api/payments/")
    assert response.status_code == 200
    assert all(item["user"]["id"] == member_user.id for item in response.data)
    assert any(item["id"] == generic_payment.id for item in response.data)


@pytest.mark.django_db
def test_retrieve_payment(api_client, member_user, generic_payment):
    client = authenticated_client_for_user(api_client, member_user)
    response = client.get(f"/api/payments/{generic_payment.id}/")
    assert response.status_code == 200
    assert response.data["id"] == generic_payment.id


@pytest.mark.django_db
def test_patch_payment(api_client, employee_user, generic_payment):
    client = authenticated_client_for_user(api_client, employee_user)
    response = client.patch(
        f"/api/payments/{generic_payment.id}/",
        data={"status": "paid"}
    )
    assert response.status_code == 200
    generic_payment.refresh_from_db()
    assert generic_payment.status == "paid"

@pytest.mark.django_db
def test_delete_payment_as_admin(api_client, admin_user, generic_payment):
    client = authenticated_client_for_user(api_client, admin_user)
    response = client.delete(f"/api/payments/{generic_payment.id}/")
    assert response.status_code == 204
    assert not Payment.objects.filter(id=generic_payment.id).exists()


@pytest.mark.django_db
def test_delete_payment_as_member_forbidden(api_client, member_user, generic_payment):
    client = authenticated_client_for_user(api_client, member_user)
    response = client.delete(f"/api/payments/{generic_payment.id}/")
    assert response.status_code in (403, 404)


@pytest.mark.django_db
def test_create_payment_as_admin(api_client, admin_user, member_user, sample_user_membership):
    client = authenticated_client_for_user(api_client, admin_user)
    content_type = ContentType.objects.get_for_model(sample_user_membership)

    payload = {
        "user": member_user.id,
        "amount": "150.00",
        "status": "pending",
        "description": "Test admin payment",
        "content_type": content_type.id,
        "object_id": sample_user_membership.id,
    }
    response = client.post("/api/payments/", data=payload)
    assert response.status_code == 201
    assert Payment.objects.filter(
        user=member_user,
        description="Test admin payment"
    ).exists()
