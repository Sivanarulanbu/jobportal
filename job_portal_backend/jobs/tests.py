from django.test import TestCase
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from jobs.models import Job, Application, UserProfile
from accounts.models import JobSeeker, Employer

class ApplicationFileTransferTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create Employer
        self.employer_user = User.objects.create_user(username='employer', password='password', email='emp@test.com')
        self.employer_user.profile.user_type = 'employer'
        self.employer_user.profile.save()
        
        Employer.objects.create(user=self.employer_user, company_name="Test Corp")
        
        # Create Job Seeker
        self.seeker_user = User.objects.create_user(username='seeker', password='password', email='seek@test.com')
        self.seeker_user.profile.user_type = 'job_seeker'
        self.seeker_user.profile.save()
        
        # Create JobSeeker profile with resume
        self.resume_file = SimpleUploadedFile("profile_cv.pdf", b"file_content", content_type="application/pdf")
        self.job_seeker = JobSeeker.objects.create(
            user=self.seeker_user,
            resume=self.resume_file,
            phone="1234567890"
        )
        
        # Create Job
        self.job = Job.objects.create(
            title="Dev",
            employer=self.employer_user,
            description="Code stuff",
            location="Remote",
            salary_min=10,
            salary_max=20
        )
        
        # Create Application with specific resume
        self.app_resume_file = SimpleUploadedFile("app_cv.pdf", b"app_content", content_type="application/pdf")
        self.application = Application.objects.create(
            job=self.job,
            applicant=self.seeker_user,
            resume=self.app_resume_file,
            cover_letter="Hire me"
        )

    def test_employer_can_view_resumes(self):
        """
        Verify that employer can fetch applications and see both:
        1. Application-specific resume
        2. Job Seeker's profile resume
        And verify that database queries are optimized.
        """
        # Login as Employer
        self.client.force_authenticate(user=self.employer_user)
        
        # We expect a low number of queries due to select_related
        # 1. Auth/User lookup (handled by force_authenticate usually, but middleware might check)
        # 2. Count query (pagination)
        # 3. Main query (Application + Job + Applicant + JobSeeker)
        # If N+1 problem existed, we'd see extra queries for fetching JobSeeker for each applicant.
        
        with self.assertNumQueries(2): 
            response = self.client.get('/api/applications/')
            
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check data
        data = response.data
        results = data['results'] if 'results' in data else data
        
        self.assertEqual(len(results), 1)
        app_data = results[0]
        
        # Verify Application Resume
        # The serializer returns a full URL or path depending on config, but it should contain the filename
        self.assertTrue(app_data.get('resume'))
        self.assertIn('app_cv', str(app_data['resume']))
        
        # Verify Profile Resume (in applicant_details)
        applicant_details = app_data.get('applicant_details')
        self.assertIsNotNone(applicant_details)
        
        # Check Profile Resume URL
        self.assertTrue(applicant_details.get('profile_resume_url'))
        self.assertIn('profile_cv', str(applicant_details['profile_resume_url']))
        
        # Verify other details
        self.assertEqual(applicant_details['phone'], '1234567890')
