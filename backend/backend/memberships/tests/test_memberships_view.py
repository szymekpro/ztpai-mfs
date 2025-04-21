import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'
import django  # type: ignore
django.setup()
from ..models import MembershipType, UserMembership
from django.contrib.auth import get_user_model

import io
from PIL import Image
from django.core.files.uploadedfile import SimpleUploadedFile

import pytest
from rest_framework.test import APIClient

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def test_user():
    User = get_user_model()
    user = User.objects.create_user(
        email='testuser@gmail.com',
        password='123',
    )
    return user

@pytest.fixture
def authenticated_client(api_client, test_user):
    api_client.force_authenticate(user=test_user)
    return api_client

@pytest.fixture
def sample_membership_type():
    return MembershipType.objects.create(
        name="Standard",
        duration_days=30,
        price=99.99,
        description="Basic gym access",
        photo_path="mtype-standard.png"
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

# -----------------------------
# MembershipTypeViewSet TESTS
# -----------------------------

@pytest.mark.django_db
def test_get_membership_types(authenticated_client, sample_membership_type):
    response = authenticated_client.get("/api/membership-types/")
    assert response.status_code == 200
    assert response.data[0]["name"] == "Standard"

@pytest.mark.django_db
def test_post_membership_type(authenticated_client):
    image = Image.new("RGB", (100, 100), color="green")
    image_io = io.BytesIO()
    image.save(image_io, format="JPEG")
    image_io.seek(0)

    mock_image = SimpleUploadedFile(
        name="standard.jpg",
        content=image_io.read(),
        content_type="image/jpeg"
    )

    payload = {
        "name": "Premium",
        "duration_days": 90,
        "price": "199.99",
        "description": "Full gym + classes",
        "photo_path": mock_image
    }

    response = authenticated_client.post("/api/membership-types/", data=payload, format='multipart')
    assert response.status_code == 201
    assert MembershipType.objects.filter(name="Premium").exists()

@pytest.mark.django_db
def test_post_membership_type_invalid(authenticated_client):
    response = authenticated_client.post("/api/membership-types/", data={}, format='multipart')
    assert response.status_code == 400

@pytest.mark.django_db
def test_put_membership_type(authenticated_client, sample_membership_type):
    payload = {
        "name": "Updated Standard",
        "duration_days": 45,
        "price": "129.99",
        "description": "Updated description"
    }
    response = authenticated_client.put(f"/api/membership-types/{sample_membership_type.id}/", data=payload)
    assert response.status_code == 200
    sample_membership_type.refresh_from_db()
    assert sample_membership_type.name == "Updated Standard"

@pytest.mark.django_db
def test_put_membership_type_not_found(authenticated_client):
    response = authenticated_client.put("/api/membership-types/9999/", data={"name": "Nonexistent"})
    assert response.status_code == 404

@pytest.mark.django_db
def test_delete_membership_type(authenticated_client, sample_membership_type):
    response = authenticated_client.delete(f"/api/membership-types/{sample_membership_type.id}/")
    assert response.status_code == 204
    assert not MembershipType.objects.filter(id=sample_membership_type.id).exists()

@pytest.mark.django_db
def test_delete_membership_type_not_found(authenticated_client):
    response = authenticated_client.delete("/api/membership-types/9999/")
    assert response.status_code == 404

# -----------------------------
# UserMembershipViewSet TESTS
# -----------------------------

@pytest.mark.django_db
def test_get_user_memberships(authenticated_client, sample_user_membership):
    response = authenticated_client.get("/api/user-memberships/")
    assert response.status_code == 200
    assert response.data[0]["membership_type"] == sample_user_membership.membership_type.id


@pytest.mark.django_db
def test_post_user_membership(authenticated_client, test_user, sample_membership_type):
    payload = {
        "user": test_user.id,
        "membership_type": sample_membership_type.id,
        "start_date": "2024-02-01",
        "end_date": "2024-03-01",
        "is_active": True
    }
    response = authenticated_client.post("/api/user-memberships/", data=payload)
    assert response.status_code == 201
    assert UserMembership.objects.filter(user=test_user).count() == 1


@pytest.mark.django_db
def test_post_user_membership_invalid(authenticated_client):
    response = authenticated_client.post("/api/user-memberships/", data={})
    print(response.data)
    assert response.status_code == 400

@pytest.mark.django_db
def test_put_user_membership(authenticated_client, sample_user_membership, test_user):
    payload = {
        "user": test_user.id,
        "membership_type": sample_user_membership.membership_type.id,
        "start_date": "2024-01-01",
        "end_date": "2024-02-01",
        "is_active": False
    }
    response = authenticated_client.put(f"/api/user-memberships/{sample_user_membership.id}/", data=payload)
    print(response.data)
    assert response.status_code == 200
    sample_user_membership.refresh_from_db()
    assert sample_user_membership.is_active is False

@pytest.mark.django_db
def test_delete_user_membership(authenticated_client, sample_user_membership):
    response = authenticated_client.delete(f"/api/user-memberships/{sample_user_membership.id}/")
    assert response.status_code == 204
    assert not UserMembership.objects.filter(id=sample_user_membership.id).exists()

@pytest.mark.django_db
def test_delete_user_membership_not_found(authenticated_client):
    response = authenticated_client.delete("/api/user-memberships/9999/")
    assert response.status_code == 404