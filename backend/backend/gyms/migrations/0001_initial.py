# Generated by Django 5.0.3 on 2025-03-27 21:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Gym',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('city', models.CharField(max_length=100)),
                ('address', models.TextField()),
                ('description', models.TextField(blank=True, null=True)),
                ('image_url', models.CharField(blank=True, default=None, max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Trainer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=50)),
                ('last_name', models.CharField(max_length=50)),
                ('bio', models.TextField(blank=True)),
                ('photo_path', models.CharField(blank=True, default=None, max_length=100)),
                ('gym', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trainers', to='gyms.gym')),
            ],
        ),
        migrations.CreateModel(
            name='TrainerAvailability',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('weekday', models.CharField(choices=[('Monday', 'Monday'), ('Tuesday', 'Tuesday'), ('Wednesday', 'Wednesday'), ('Thursday', 'Thursday'), ('Friday', 'Friday'), ('Saturday', 'Saturday'), ('Sunday', 'Sunday')], max_length=10)),
                ('start_time', models.TimeField()),
                ('end_time', models.TimeField()),
                ('trainer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='availabilities', to='gyms.trainer')),
            ],
        ),
    ]
