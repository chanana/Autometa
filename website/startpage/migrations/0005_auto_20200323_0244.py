# Generated by Django 3.0.3 on 2020-03-23 02:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('startpage', '0004_uploads_date_uploaded'),
    ]

    operations = [
        migrations.AlterField(
            model_name='uploads',
            name='file',
            field=models.FileField(upload_to='uploads/'),
        ),
    ]
