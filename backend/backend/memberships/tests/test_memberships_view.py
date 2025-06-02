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
    user = User.objects.create_user(
        email='testuser@gmail.com',
        password='123',
        role='member',
    )
    return user

@pytest.fixture
def authenticated_client(api_client, test_user):
    api_client.force_authenticate(user=test_user)
    return api_client

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
        price=99.99,
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

    mock_image = generate_dummy_image()

    payload = {
        "name": "Premium",
        "duration_days": 90,
        "price": "199.99",
        "description": "Full gym + classes",
        "photo": mock_image
    }
    response = authenticated_client.post("/api/membership-types/", data=payload, format='multipart')
    print(response.data)
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
    assert response.data[0]["membership_type"]["id"] == sample_user_membership.membership_type.id


@pytest.mark.django_db
def test_post_user_membership(authenticated_client, test_user, sample_membership_type):
    payload = {
        "user": test_user.id,
        "membership_type": sample_membership_type,
        "membership_type_id": sample_membership_type.id,
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
        "membership_type": sample_user_membership.membership_type,
        "membership_type_id": sample_user_membership.membership_type.id,
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
def test_put_user_membership_not_found(authenticated_client):
    payload = {
        "start_date": "2024-01-01",
        "end_date": "2024-02-01",
        "is_active": False
    }
    response = authenticated_client.put("/api/user-memberships/9999/", data=payload)
    assert response.status_code == 404


@pytest.mark.django_db
def test_delete_user_membership(authenticated_client, sample_user_membership):
    response = authenticated_client.delete(f"/api/user-memberships/{sample_user_membership.id}/")
    assert response.status_code == 204
    assert not UserMembership.objects.filter(id=sample_user_membership.id).exists()

@pytest.mark.django_db
def test_delete_user_membership_not_found(authenticated_client):
    response = authenticated_client.delete("/api/user-memberships/9999/")
    assert response.status_code == 404

@pytest.mark.django_db
def test_get_my_memberships(authenticated_client, sample_user_membership):
    response = authenticated_client.get("/api/membership-types/my-memberships/")
    assert response.status_code == 200
    assert isinstance(response.data, list)
    assert len(response.data) == 1
    assert response.data[0]["membership_type"]["id"] == sample_user_membership.membership_type.id

@pytest.mark.django_db
def test_has_active_membership_true(authenticated_client, sample_user_membership):
    response = authenticated_client.get("/api/user-memberships/active/")
    assert response.status_code == 200
    assert response.data == {"has_membership": True}

@pytest.mark.django_db
def test_has_active_membership_false(authenticated_client):
    response = authenticated_client.get("/api/user-memberships/active/")
    assert response.status_code == 200
    assert response.data == {"has_membership": False}

@pytest.mark.django_db
def test_get_membership_type_detail(authenticated_client, sample_membership_type):
    response = authenticated_client.get(f"/api/membership-types/{sample_membership_type.id}/")
    assert response.status_code == 200
    assert response.data["name"] == sample_membership_type.name

@pytest.mark.django_db
def test_patch_membership_type(authenticated_client, sample_membership_type):
    payload = {"price": "149.99"}
    response = authenticated_client.patch(f"/api/membership-types/{sample_membership_type.id}/", data=payload)
    assert response.status_code == 200
    sample_membership_type.refresh_from_db()
    assert float(sample_membership_type.price) == 149.99

@pytest.mark.django_db
def test_patch_user_membership(authenticated_client, sample_user_membership):
    payload = {"is_active": False}
    response = authenticated_client.patch(f"/api/user-memberships/{sample_user_membership.id}/", data=payload)
    assert response.status_code == 200
    sample_user_membership.refresh_from_db()
    assert sample_user_membership.is_active is False

@pytest.mark.django_db
def test_get_user_membership_detail(authenticated_client, sample_user_membership):
    response = authenticated_client.get(f"/api/user-memberships/{sample_user_membership.id}/")
    assert response.status_code == 200
    assert response.data["id"] == sample_user_membership.id
