
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'backend.settings'
import django  # type: ignore
django.setup()
import pytest
import tempfile
from decimal import Decimal
from django.utils.timezone import now, timedelta
from django.test.utils import override_settings
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

from gyms.models import Gym, Trainer, TrainerService
from trainings.models import ScheduledTraining
from payments.models import Payment


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
        email='member@gym.pl',
        password='member123',
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
def test_gym():
    return Gym.objects.create(name="Gym Alpha", city="Test City")


@pytest.fixture
def test_trainer(test_gym):
    return Trainer.objects.create(
        first_name="Anna",
        last_name="Trainer",
        gym=test_gym
    )


@pytest.fixture
def test_service(test_trainer):
    return TrainerService.objects.create(
        name="Strength Training",
        price=Decimal("150.00"),
        description="Sample description",
    )


@pytest.fixture
def test_training(member_user, test_trainer, test_gym, test_service):
    return ScheduledTraining.objects.create(
        user=member_user,
        trainer=test_trainer,
        gym=test_gym,
        service_type=test_service,
        start_time=now() + timedelta(days=1),
        end_time=now() + timedelta(days=1, hours=1),
        status="scheduled",
        description="Initial training"
    )


def authenticated_client_for_user(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client

@pytest.mark.django_db
def test_list_trainings_as_member(api_client, member_user, test_training):
    client = authenticated_client_for_user(api_client, member_user)
    response = client.get("/api/trainings/")
    assert response.status_code == 200
    assert all(item["user"] == member_user.id for item in response.data)


@pytest.mark.django_db
def test_create_training_and_generate_payment(api_client, member_user, test_trainer, test_gym, test_service):
    client = authenticated_client_for_user(api_client, member_user)
    payload = {
        "trainer_id": test_trainer.id,
        "gym": test_gym.id,
        "service_type_id": test_service.id,
        "start_time": (now() + timedelta(days=3)).isoformat(),
        "end_time": (now() + timedelta(days=3, hours=1)).isoformat(),
        "status": "scheduled",
        "description": "Scheduled training"
    }

    response = client.post("/api/trainings/", data=payload, format="json")
    assert response.status_code == 201

    training_id = response.data["id"]
    training = ScheduledTraining.objects.get(id=training_id)
    payment = Payment.objects.get(object_id=training.id)

    assert payment.user == member_user
    assert payment.amount == test_service.price
    assert payment.status == "pending"


@pytest.mark.django_db
def test_retrieve_training(api_client, member_user, test_training):
    client = authenticated_client_for_user(api_client, member_user)
    response = client.get(f"/api/trainings/{test_training.id}/")
    assert response.status_code == 200
    assert response.data["id"] == test_training.id


@pytest.mark.django_db
def test_forbid_access_to_others_training(api_client, admin_user, test_training):
    client = authenticated_client_for_user(api_client, admin_user)
    response = client.get(f"/api/trainings/{test_training.id}/")
    assert response.status_code in (403, 404)


@pytest.mark.django_db
def test_update_training_status(api_client, member_user, test_training):
    client = authenticated_client_for_user(api_client, member_user)
    response = client.patch(
        f"/api/trainings/{test_training.id}/",
        data={"status": "cancelled"},
        format="json"
    )
    assert response.status_code == 200
    test_training.refresh_from_db()
    assert test_training.status == "cancelled"


@pytest.mark.django_db
def test_delete_training(api_client, member_user, test_training):
    client = authenticated_client_for_user(api_client, member_user)
    response = client.delete(f"/api/trainings/{test_training.id}/")
    assert response.status_code == 204
    assert not ScheduledTraining.objects.filter(id=test_training.id).exists()

@pytest.mark.django_db
def test_invalid_time_range_on_create(api_client, member_user, test_trainer, test_gym, test_service):
    client = authenticated_client_for_user(api_client, member_user)
    payload = {
        "trainer_id": test_trainer.id,
        "gym": test_gym.id,
        "service_type_id": test_service.id,
        "start_time": (now() + timedelta(days=2)).isoformat(),
        "end_time": (now() + timedelta(days=1)).isoformat(),
        "status": "scheduled",
        "description": "Invalid time range"
    }
    response = client.post("/api/trainings/", data=payload, format="json")
    assert response.status_code == 400


@pytest.mark.django_db
def test_member_sees_only_own_trainings(api_client, member_user, admin_user, test_trainer, test_gym, test_service):
    ScheduledTraining.objects.create(
        user=admin_user,
        trainer=test_trainer,
        gym=test_gym,
        service_type=test_service,
        start_time=now() + timedelta(days=5),
        end_time=now() + timedelta(days=5, hours=1),
        status="scheduled"
    )
    client = authenticated_client_for_user(api_client, member_user)
    response = client.get("/api/trainings/")
    assert response.status_code == 200
    assert all(training["user"] == member_user.id for training in response.data)
