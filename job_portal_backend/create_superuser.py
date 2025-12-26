from django.contrib.auth import get_user_model
import os

User = get_user_model()
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'Siva')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'krishnananbu99@gmail.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'Siva5107')

if not User.objects.filter(username=username).exists():
    print(f"Creating superuser: {username}")
    User.objects.create_superuser(username, email, password)
else:
    print(f"Superuser {username} already exists.")
