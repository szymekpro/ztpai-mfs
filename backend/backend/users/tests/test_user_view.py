import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'
import django  # type: ignore
django.setup()

import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from django.test.utils import override_settings
import tempfile


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture(autouse=True)
def use_temp_media_root():
    with tempfile.TemporaryDirectory() as tmpdirname:
        with override_settings(MEDIA_ROOT=tmpdirname):
            yield


@pytest.fixture
def member_user():
    User = get_user_model()
    return User.objects.create_user(
        email="member@gym.pl",
        password="member123",
        role="member"
    )


@pytest.fixture
def admin_user():
    User = get_user_model()
    return User.objects.create_user(
        email="admin@gym.pl",
        password="admin123",
        role="admin"
    )


def authenticated_client_for_user(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client


@pytest.mark.django_db
def test_register_user(api_client):
    payload = {
        "email": "newuser@example.com",
        "password": "testpass123",
        "first_name": "janusz",
        "last_name": "Kowaslki",
        "phone": "266089595",
        "street": "Zamkowa",
        "street_number": "12",
        "city": "Kraków",
        "postal_code": "62-225"
    }
    response = api_client.post("/api/user/register/", data=payload)
    assert response.status_code == 201
    assert "message" in response.data


@pytest.mark.django_db
def test_register_invalid_user(api_client):
    payload = {
        "email": "newuser@example.com",
        "first_name": "John",
        "last_name": "Kowaslki",
        "phone": "266089595",
        "street": "Zamkowa",
        "street_number": "12",
        "postal_code": "62-225",
    }
    response = api_client.post("/api/user/register/", data=payload)
    assert response.status_code == 400
    assert "password" in response.data

@pytest.mark.django_db
def test_get_current_user_data(api_client, member_user):
    client = authenticated_client_for_user(api_client, member_user)
    response = client.get("/api/users/me/")
    assert response.status_code == 200
    assert response.data["email"] == member_user.email
    assert response.data["role"] == "member"

@pytest.mark.django_db
def test_list_users_as_admin(api_client, admin_user, member_user):
    client = authenticated_client_for_user(api_client, admin_user)
    response = client.get("/api/users/")
    assert response.status_code == 200
    assert any(u["email"] == member_user.email for u in response.data)


@pytest.mark.django_db
def test_list_users_as_member_forbidden(api_client, member_user):
    client = authenticated_client_for_user(api_client, member_user)
    response = client.get("/api/users/")
    assert response.status_code in (403, 404)

@pytest.mark.django_db
def test_retrieve_user_as_admin(api_client, admin_user, member_user):
    client = authenticated_client_for_user(api_client, admin_user)
    response = client.get(f"/api/users/{member_user.id}/")
    assert response.status_code == 200
    assert response.data["email"] == member_user.email


@pytest.mark.django_db
def test_retrieve_user_as_member_forbidden(api_client, member_user, admin_user):
    client = authenticated_client_for_user(api_client, member_user)
    response = client.get(f"/api/users/{admin_user.id}/")
    assert response.status_code in (403, 404)

@pytest.mark.django_db
def test_patch_user_as_admin(api_client, admin_user, member_user):
    client = authenticated_client_for_user(api_client, admin_user)
    response = client.patch(
        f"/api/users/{member_user.id}/",
        data={"first_name": "Updated"},
        format="json"
    )
    assert response.status_code == 200
    assert response.data["first_name"] == "Updated"


@pytest.mark.django_db
def test_patch_user_as_member_forbidden(api_client, member_user, admin_user):
    client = authenticated_client_for_user(api_client, member_user)
    response = client.patch(
        f"/api/users/{admin_user.id}/",
        data={"first_name": "Nope"},
        format="json"
    )
    assert response.status_code in (403, 404)

@pytest.mark.django_db
def test_delete_user_as_admin(api_client, admin_user, member_user):
    client = authenticated_client_for_user(api_client, admin_user)
    response = client.delete(f"/api/users/{member_user.id}/")
    assert response.status_code == 204


@pytest.mark.django_db
def test_delete_user_as_member_forbidden(api_client, member_user, admin_user):
    client = authenticated_client_for_user(api_client, member_user)
    response = client.delete(f"/api/users/{admin_user.id}/")
    assert response.status_code in (403, 404)
