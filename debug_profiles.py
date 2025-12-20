#!/usr/bin/env python3
"""Debug script to check user profiles in database"""
import os
import sys

# Add the backend directory to path
sys.path.insert(0, r'c:\Users\Dell\job-portal\job_portal_backend')
os.chdir(r'c:\Users\Dell\job-portal\job_portal_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'job_portal.settings')

import django
django.setup()

from django.contrib.auth.models import User
from jobs.models import UserProfile
from accounts.models import JobSeeker, Employer

users = User.objects.all().order_by('-id')[:5]
print(f"\nRecent users:\n")
for u in users:
    has_profile = UserProfile.objects.filter(user=u).exists()
    has_seeker = JobSeeker.objects.filter(user=u).exists()
    has_employer = Employer.objects.filter(user=u).exists()
    profile = UserProfile.objects.filter(user=u).first()
    profile_type = profile.user_type if profile else None
    print(f"  {u.username}:")
    print(f"    UserProfile={has_profile} (type={profile_type})")
    print(f"    JobSeeker={has_seeker}")
    print(f"    Employer={has_employer}")
    print()
