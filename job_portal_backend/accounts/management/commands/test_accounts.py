from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import JobSeeker, Employer, UserAccountHistory


class Command(BaseCommand):
    help = 'Test accounts app functionality - registration, signals, and email'

    def add_arguments(self, parser):
        parser.add_argument('--user_type', type=str, default='job_seeker', help='User type: job_seeker or employer')
        parser.add_argument('--username', type=str, default='test_user', help='Username for test account')
        parser.add_argument('--email', type=str, default='test@example.com', help='Email for test account')
        parser.add_argument('--password', type=str, default='TestPass123', help='Password for test account')

    def handle(self, *args, **options):
        user_type = options['user_type']
        username = options['username']
        email = options['email']
        password = options['password']

        self.stdout.write(self.style.SUCCESS(f"\n{'='*60}"))
        self.stdout.write(self.style.SUCCESS(f"Testing Accounts App - {user_type.upper()}"))
        self.stdout.write(self.style.SUCCESS(f"{'='*60}\n"))

        # Check if user already exists
        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f"⚠️  User {username} already exists. Skipping creation."))
            user = User.objects.get(username=username)
        else:
            # Create user
            try:
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    first_name=username.split('_')[0].title()
                )
                self.stdout.write(self.style.SUCCESS(f"✅ User created: {username}"))
                self.stdout.write(f"   📧 Email: {email}")
                self.stdout.write(f"   🔐 Password: {password}")
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"❌ Error creating user: {str(e)}"))
                return

        # Check if appropriate profile exists based on user_type
        if user_type == 'job_seeker':
            if hasattr(user, 'job_seeker'):
                job_seeker = user.job_seeker
                self.stdout.write(self.style.SUCCESS(f"✅ JobSeeker profile already exists!"))
                self.stdout.write(f"   Created: {job_seeker.created_at}")
                self.stdout.write(f"   Profile Complete: {job_seeker.is_profile_complete}")
            else:
                try:
                    job_seeker = JobSeeker.objects.create(user=user)
                    self.stdout.write(self.style.ERROR(f"⚠️  JobSeeker profile created manually (signal should have done this)"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"❌ Error: {str(e)}"))
                    return

        elif user_type == 'employer':
            if hasattr(user, 'employer'):
                employer = user.employer
                self.stdout.write(self.style.SUCCESS(f"✅ Employer profile already exists!"))
                self.stdout.write(f"   Company: {employer.company_name}")
                self.stdout.write(f"   Created: {employer.created_at}")
                self.stdout.write(f"   Verified: {employer.is_verified}")
            else:
                try:
                    employer = Employer.objects.create(user=user, company_name=f"{username} Company")
                    self.stdout.write(self.style.ERROR(f"⚠️  Employer profile created manually (signal should have done this)"))
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f"❌ Error: {str(e)}"))
                    return

        # Show account history
        self.stdout.write(self.style.SUCCESS(f"\n📋 Account History:"))
        history = UserAccountHistory.objects.filter(user=user).order_by('-created_at')[:5]
        if history.exists():
            for record in history:
                self.stdout.write(f"   • {record.action}: {record.description} ({record.created_at})")
        else:
            self.stdout.write(self.style.WARNING(f"   No history records found"))

        # Summary
        self.stdout.write(self.style.SUCCESS(f"\n{'='*60}"))
        self.stdout.write(self.style.SUCCESS(f"✅ Test Complete!"))
        self.stdout.write(self.style.SUCCESS(f"{'='*60}\n"))
        self.stdout.write("You can now test the API endpoints:")
        self.stdout.write(f"  • Register: POST /api/accounts/auth/register/")
        self.stdout.write(f"  • Login: POST /api/accounts/auth/login/")
        self.stdout.write(f"  • Current User: GET /api/accounts/auth/current_user/")
        if user_type == 'job_seeker':
            self.stdout.write(f"  • Profile: GET /api/accounts/job-seekers/my_profile/")
            self.stdout.write(f"  • Update Profile: PUT /api/accounts/job-seekers/update_profile/")
        else:
            self.stdout.write(f"  • Profile: GET /api/accounts/employers/my_profile/")
            self.stdout.write(f"  • Update Profile: PUT /api/accounts/employers/update_profile/")
        self.stdout.write("")
