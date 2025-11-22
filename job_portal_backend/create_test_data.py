#!/usr/bin/env python
"""
Test script to verify employer functionality
"""
import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal_backend.settings')
django.setup()

from django.contrib.auth.models import User
from jobs.models import UserProfile, Job, Application
from datetime import datetime, timedelta

# Clear existing test data
User.objects.filter(username__in=['employer_test', 'jobseeker_test']).delete()

print("Creating test users...")

# Create employer user
employer_user = User.objects.create_user(
    username='employer_test',
    email='employer@test.com',
    password='password123',
    first_name='John',
    last_name='Employer'
)
employer_profile = UserProfile.objects.get(user=employer_user)
employer_profile.user_type = 'employer'
employer_profile.company_name = 'Test Company'
employer_profile.save()
print(f"✓ Created employer user: {employer_user.username} (user_type: {employer_profile.user_type})")

# Create job seeker user
jobseeker_user = User.objects.create_user(
    username='jobseeker_test',
    email='jobseeker@test.com',
    password='password123',
    first_name='Jane',
    last_name='Seeker'
)
jobseeker_profile = UserProfile.objects.get(user=jobseeker_user)
jobseeker_profile.user_type = 'job_seeker'
jobseeker_profile.save()
print(f"✓ Created job seeker user: {jobseeker_user.username} (user_type: {jobseeker_profile.user_type})")

# Create a test job
print("\nCreating test job...")
job = Job.objects.create(
    title='Senior React Developer',
    company='Test Company',
    location='Remote',
    job_type='full-time',
    description='We are looking for an experienced React developer...',
    requirements='5+ years of React experience, TypeScript knowledge',
    salary_min=80000,
    salary_max=120000,
    skills='React, TypeScript, Node.js',
    employer=employer_user,
    deadline=datetime.now().date() + timedelta(days=30)
)
print(f"✓ Created job: {job.title}")

# Create a test application
print("\nCreating test application...")
application = Application.objects.create(
    job=job,
    applicant=jobseeker_user,
    cover_letter='I am interested in this role',
    status='pending'
)
print(f"✓ Created application with status: {application.status}")

print("\n" + "="*50)
print("TEST DATA SETUP COMPLETE")
print("="*50)
print("\nTest Credentials:")
print("Employer - Username: employer_test, Password: password123")
print("Job Seeker - Username: jobseeker_test, Password: password123")
print("\nUser Types in Database:")
print(f"Employer user_type: {employer_profile.user_type}")
print(f"Job Seeker user_type: {jobseeker_profile.user_type}")
