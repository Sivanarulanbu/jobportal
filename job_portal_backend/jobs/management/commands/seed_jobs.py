from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from jobs.models import Job, UserProfile
from datetime import date

class Command(BaseCommand):
    help = 'Seed database with sample job listings'

    def handle(self, *args, **options):
        # Create or get test employer user
        employer, created = User.objects.get_or_create(
            username='employer1',
            defaults={
                'email': 'employer@test.com',
                'first_name': 'Tech',
                'last_name': 'Corp'
            }
        )
        
        # Create employer profile if it doesn't exist
        UserProfile.objects.get_or_create(
            user=employer,
            defaults={'user_type': 'employer', 'company_name': 'Tech Corp'}
        )

        # Sample job listings
        sample_jobs = [
            {
                'title': 'Senior Frontend Developer',
                'company': 'Tech Corp',
                'location': 'Remote',
                'job_type': 'full-time',
                'description': 'We are looking for an experienced Frontend Developer with expertise in React and modern web technologies.',
                'requirements': 'React, JavaScript, CSS, REST APIs, Git',
                'salary_min': 80000,
                'salary_max': 120000,
                'experience_required': '3+ years',
                'skills': 'React, JavaScript, TypeScript, Tailwind CSS, Redux',
                'deadline': date(2025, 12, 31),
            },
            {
                'title': 'Backend Developer (Python/Django)',
                'company': 'Tech Corp',
                'location': 'Bangalore',
                'job_type': 'full-time',
                'description': 'Build scalable backend services using Django and Django REST Framework.',
                'requirements': 'Python, Django, PostgreSQL, REST APIs',
                'salary_min': 75000,
                'salary_max': 110000,
                'experience_required': '2+ years',
                'skills': 'Python, Django, PostgreSQL, REST APIs, Docker',
                'deadline': date(2025, 12, 15),
            },
            {
                'title': 'Full Stack Developer',
                'company': 'Tech Corp',
                'location': 'Hybrid',
                'job_type': 'full-time',
                'description': 'Full-stack developer needed for building modern web applications.',
                'requirements': 'React, Node.js, MongoDB, REST APIs',
                'salary_min': 90000,
                'salary_max': 130000,
                'experience_required': '3+ years',
                'skills': 'React, Node.js, MongoDB, JavaScript, Docker',
                'deadline': date(2025, 12, 20),
            },
            {
                'title': 'UI/UX Designer',
                'company': 'Tech Corp',
                'location': 'Remote',
                'job_type': 'full-time',
                'description': 'Design beautiful and intuitive user interfaces for our web and mobile applications.',
                'requirements': 'Figma, Wireframing, User Research',
                'salary_min': 60000,
                'salary_max': 90000,
                'experience_required': '2+ years',
                'skills': 'Figma, Sketch, Adobe XD, Wireframing, User Research',
                'deadline': date(2025, 12, 25),
            },
            {
                'title': 'DevOps Engineer',
                'company': 'Tech Corp',
                'location': 'Bangalore',
                'job_type': 'full-time',
                'description': 'Manage and optimize our cloud infrastructure and CI/CD pipelines.',
                'requirements': 'AWS, Docker, Kubernetes, Linux',
                'salary_min': 85000,
                'salary_max': 125000,
                'experience_required': '2+ years',
                'skills': 'AWS, Docker, Kubernetes, Linux, Git',
                'deadline': date(2025, 12, 28),
            },
            {
                'title': 'Data Scientist',
                'company': 'Tech Corp',
                'location': 'Remote',
                'job_type': 'full-time',
                'description': 'Build machine learning models and analyze large datasets.',
                'requirements': 'Python, Machine Learning, Statistics',
                'salary_min': 100000,
                'salary_max': 150000,
                'experience_required': '2+ years',
                'skills': 'Python, Machine Learning, TensorFlow, SQL, Statistics',
                'deadline': date(2025, 12, 30),
            },
        ]

        # Create jobs
        created_count = 0
        for job_data in sample_jobs:
            job, created = Job.objects.get_or_create(
                title=job_data['title'],
                company=job_data['company'],
                defaults={
                    'employer': employer,
                    **job_data
                }
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created: {job.title}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Already exists: {job.title}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\nSuccessfully created {created_count} sample jobs!')
        )
