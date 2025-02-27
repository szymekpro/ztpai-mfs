FROM python:3.10-alpine

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

WORKDIR /app/backend

ARG BACKEND_PORT_INTERNAL
ENV RUN_SERVER "python manage.py runserver 0.0.0.0:${BACKEND_PORT_INTERNAL}"

COPY requirements.txt /tmp/requirements.txt

RUN apk add --no-cache \
        postgresql-libs \
        libpq \
        gcc \
        musl-dev \
        python3-dev && \
    pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r /tmp/requirements.txt && \
    apk del gcc musl-dev python3-dev

COPY . /app/backend/

CMD ["sh", "-c", "python manage.py migrate && ${RUN_SERVER}"]
