from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from jobs.models import UserProfile

class Command(BaseCommand):
    help = 'Test user creation and signals'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, help='Username for new user')
        parser.add_argument('--email', type=str, help='Email for new user')
        parser.add_argument('--password', type=str, help='Password for new user')

    def handle(self, *args, **options):
        username = options.get('username') or 'testuser'
        email = options.get('email') or 'test@example.com'
        password = options.get('password') or 'testpass123'

        try:
            # Create new user
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name='Test'
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'✅ User created: {username}')
            )
            self.stdout.write(
                self.style.SUCCESS(f'📧 Email: {email}')
            )
            
            # Check if profile was created via signal
            if hasattr(user, 'profile'):
                self.stdout.write(
                    self.style.SUCCESS(f'✅ UserProfile created via signal!')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'⚠️  UserProfile not found!')
                )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Error: {str(e)}')
            )
