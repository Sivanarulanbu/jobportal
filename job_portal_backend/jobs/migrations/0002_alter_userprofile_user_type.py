# Generated migration for user_type field update

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='user_type',
            field=models.CharField(
                choices=[('job_seeker', 'Job Seeker'), ('employer', 'Employer')],
                default='job_seeker',
                max_length=20
            ),
        ),
    ]
