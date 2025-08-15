# Generated manually to remove Certificate model and table

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('resume', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Certificate',
        ),
    ]
