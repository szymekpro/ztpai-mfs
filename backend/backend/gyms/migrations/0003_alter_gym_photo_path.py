# Generated by Django 5.0.3 on 2025-04-02 19:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gyms', '0002_rename_image_url_gym_photo_path'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gym',
            name='photo_path',
            field=models.ImageField(blank=True, default='gym-standard.png', upload_to=''),
        ),
    ]
