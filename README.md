# MyFitnessSpace 
Gym Membership & Workout Scheduling and Management System

# Project Description

**MyFitnessSpace** is a full-stack SaaS platform for managing a network of gyms. It allows users to:
- book personal training sessions,
- purchase membership passes,
- view their workout calendar,
- browse available trainers and gym locations,
- make payments.

Administrators and employees have access to dashboards to manage offers, users, payments, and gym resources.

# Architecture Overview
```
Frontend (React + Vite + Typescript)
│
├── communicates via REST API
│
Backend (Django + DRF)
│ ├── Auth & Permissions (JWT)
│ ├── REST API for users, trainings, memberships, payments
│ └── PostgreSQL database
│
└── External Integrations:
├── RabbitMQ
└── Brevo
```

# Technologies Used & Justification

### Backend
- **Django + Django REST Framework** – Rapid API development, built-in auth, powerful ORM.
- **PostgreSQL** – Stable, relational DB with time zone and JSON support.
- **pytest** – Fast, maintainable unit testing with fixtures.
- **DRF Spectacular** – Automated and customizable OpenAPI documentation.

### Frontend
- **React + TypeScript + Vite** – Modern, fast, type-safe frontend development stack.
- **Material UI** – Fast, custom design flexibility.

### DevOps & Other
- **Docker + Docker Compose** – Consistent local and production environments.
- **JWT (SimpleJWT)** – Secure, stateless authentication for frontend-backend integration.
- **Brevo API** – Transactional email service used for sending booking confirmations and account notifications.
- **RabbitMQ** – Message broker used with Celery for asynchronous background tasks (e.g., sending emails, updating external APIs).

# Getting Started

In order to deploy application you have to:

1. Clone the Repository

2. In backend, create db.env file in backend directory and .env file in backend/backend directory.

3. Add following variables to db.env:
  
   - ```POSTGRES_USER```=postgres
   - ```POSTGRES_USER```=postgres
   - ```POSTGRES_DB```=postgres
  
4. Add following variables to .env:

  - ```BREVO_API_KEY=``` *(ask project author for unique key)*
  - ```SECRET_KEY=``` *(generate using the following command:)*

  ```sh
  python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   ```

5. In frontend main directory create .env and add following:

  - ```BASE_VITE_API_URL```= 'http://localhost:8000/api'
   
6. Run ```docker compose up -d --build```

