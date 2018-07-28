# Generated by Django 2.0.7 on 2018-07-28 16:44

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='EntryEdit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20)),
                ('category', models.CharField(max_length=75)),
            ],
        ),
        migrations.CreateModel(
            name='TableEdit',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('correctDate', models.DateField(blank=True, null=True)),
                ('place', models.CharField(blank=True, max_length=20, null=True)),
                ('moderator', models.CharField(blank=True, max_length=20, null=True)),
                ('topic', models.CharField(blank=True, max_length=75, null=True)),
                ('children', models.CharField(blank=True, max_length=20, null=True)),
                ('remarks', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
    ]
