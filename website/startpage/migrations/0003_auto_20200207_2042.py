# Generated by Django 3.0.3 on 2020-02-07 20:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('startpage', '0002_auto_20200206_0436'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='job',
            name='project',
        ),
        migrations.AddField(
            model_name='job',
            name='descripton',
            field=models.TextField(default='<django.db.models.fields.CharField>'),
        ),
        migrations.DeleteModel(
            name='Project',
        ),
    ]
