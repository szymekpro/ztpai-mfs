import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'
import django  # type: ignore
django.setup()
from ..models import Gym, Trainer, TrainerAvailability
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
def sample_gym():
    mock_image = generate_dummy_image()

    return Gym.objects.create(
        name="FitZone",
        city="Warsaw",
        address="Main St 123",
        description="Description",
        photo=mock_image,
    )

@pytest.fixture
def sample_trainer(sample_gym):
    mock_image = generate_dummy_image()

    return Trainer.objects.create(
        first_name="Anna",
        last_name="Nowak",
        gym=sample_gym,
        bio="sample bio",
        photo=mock_image,
    )

@pytest.fixture
def sample_availability(sample_trainer):
    return TrainerAvailability.objects.create(
        trainer=sample_trainer,
        weekday="Monday",
        start_time="09:00",
        end_time="12:00"
    )

@pytest.mark.django_db
def test_get_gyms(authenticated_client, sample_gym):
    response = authenticated_client.get("/api/gyms/")
    assert response.status_code == 200
    assert response.data[0]["name"] == "FitZone"

@pytest.mark.django_db
def test_post_gym(authenticated_client):
    payload = {
        "name": "PowerGym",
        "city": "Krakow",
        "address": "Street 5",
        "description": "Best gym in town"
    }
    response = authenticated_client.post("/api/gyms/", data=payload)
    assert response.status_code == 201
    assert Gym.objects.filter(name="PowerGym").exists()

@pytest.mark.django_db
def test_post_gym_invalid(authenticated_client):
    response = authenticated_client.post("/api/gyms/", data={})
    assert response.status_code == 400

@pytest.mark.django_db
def test_patch_gym(authenticated_client, sample_gym):


    mock_image = generate_dummy_image()

    response = authenticated_client.patch(
        f"/api/gyms/{sample_gym.id}/",
        data={
            "name": "Updated Gym",
            "photo": mock_image,
        },
        format='multipart'
    )

    assert response.status_code == 200
    sample_gym.refresh_from_db()
    assert sample_gym.name == "Updated Gym"

@pytest.mark.django_db
def test_delete_gym(authenticated_client, sample_gym):
    response = authenticated_client.delete(f"/api/gyms/{sample_gym.id}/")
    assert response.status_code == 204
    assert not Gym.objects.filter(id=sample_gym.id).exists()

@pytest.mark.django_db
def test_get_trainers(authenticated_client, sample_trainer):
    response = authenticated_client.get("/api/trainers/")
    assert response.status_code == 200
    assert response.data[0]["first_name"] == "Anna"

@pytest.mark.django_db
def test_post_trainer(authenticated_client, sample_gym):
    mock_image = generate_dummy_image()

    response = authenticated_client.post(
        "/api/trainers/",
        data={
            "first_name": "John",
            "last_name": "Smith",
            "gym": sample_gym.id,
            "bio": "Trainer bio",
            "photo": mock_image
        },
        format='multipart'
    )
    assert response.status_code == 201
    assert Trainer.objects.filter(first_name="John").exists()

@pytest.mark.django_db
def test_post_trainer_invalid(authenticated_client):
    response = authenticated_client.post("/api/trainers/", data={})
    assert response.status_code == 400

@pytest.mark.django_db
def test_patch_trainer(authenticated_client, sample_trainer):
    response = authenticated_client.patch(
        f"/api/trainers/{sample_trainer.id}/",
        data={
            "last_name": "Kowalska"
        }
    )
    assert response.status_code == 200
    sample_trainer.refresh_from_db()
    assert sample_trainer.last_name == "Kowalska"

@pytest.mark.django_db
def test_delete_trainer(authenticated_client, sample_trainer):
    response = authenticated_client.delete(f"/api/trainers/{sample_trainer.id}/")
    assert response.status_code == 204
    assert not Trainer.objects.filter(id=sample_trainer.id).exists()