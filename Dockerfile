FROM python:3.13.0-alpine3.20

ENV PYTHONUNBUFFERED 1

COPY backend/backend/requirements.txt /backend/backend/requirements.txt

ENV PATH="/py/bin:$PATH"
RUN python -m venv /py && \
    pip install --upgrade pip && \
    apk add --update --upgrade --no-cache postgresql-client && \
    apk add --update --upgrade --no-cache --virtual .tmp \
        build-base postgresql-dev

RUN pip install -r backend/backend/requirements.txt && apk del .tmp

COPY backend /backend
WORKDIR /backend

CMD ["sh", "-c", "python manage.py runserver 0.0.0.0:8000"]
