# Generated by Django 3.0.3 on 2020-03-18 19:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('startpage', '0010_auto_20200318_1748'),
    ]

    operations = [
        migrations.CreateModel(
            name='JobResult',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('result', models.FileField(upload_to='results/')),
            ],
        ),
    ]
