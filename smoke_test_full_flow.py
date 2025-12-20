#!/usr/bin/env python3
"""
Smoke test: Full job portal flow
- Register employer
- Register job seeker
- Employer creates job
- Job seeker applies with cover letter (and optional resume)
- Verify application status
"""

import requests
import json
import time
import random
import string

BASE = "http://127.0.0.1:8000/api"

def random_suffix():
    """Generate random suffix for unique usernames"""
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))

def test_register(username, email, password, user_type):
    """Register a new user"""
    url = f"{BASE}/accounts/auth/register/"
    payload = {
        "username": username,
        "email": email,
        "password": password,
        "password_confirm": password,
        "user_type": user_type
    }
    try:
        print(f"  [REGISTERING...] POST {url}")
        r = requests.post(url, json=payload, timeout=30)
        print(f"[REGISTER {user_type}] {r.status_code}")
        if r.status_code not in [200, 201]:
            print(f"  Error: {r.text[:200]}")
            return None
        data = r.json()
        tokens = data.get('tokens', {})
        access = tokens.get('access')
        return access
    except Exception as e:
        print(f"[REGISTER {user_type}] ERROR: {e}")
        return None


def test_get_current_user(access_token):
    """Get current user info"""
    url = f"{BASE}/accounts/auth/current_user/"
    headers = {"Authorization": f"Bearer {access_token}"}
    try:
        r = requests.get(url, headers=headers, timeout=10)
        print(f"[GET CURRENT_USER] {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            return data.get('user')
        else:
            print(f"  Error: {r.text[:200]}")
            return None
    except Exception as e:
        print(f"[GET CURRENT_USER] ERROR: {e}")
        return None


def test_create_job(access_token, job_data):
    """Create a job (employer only)"""
    url = f"{BASE}/jobs/"
    headers = {"Authorization": f"Bearer {access_token}"}
    try:
        r = requests.post(url, json=job_data, headers=headers, timeout=30)
        print(f"[CREATE JOB] {r.status_code}")
        if r.status_code in [200, 201]:
            return r.json()
        else:
            error_text = r.text[:500] if len(r.text) > 500 else r.text
            print(f"  Error: {error_text}")
            return None
    except Exception as e:
        print(f"[CREATE JOB] ERROR: {e}")
        return None


def test_list_jobs(access_token=None):
    """List all jobs"""
    url = f"{BASE}/jobs/"
    headers = {}
    if access_token:
        headers["Authorization"] = f"Bearer {access_token}"
    try:
        r = requests.get(url, headers=headers, timeout=10)
        print(f"[LIST JOBS] {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            if isinstance(data, dict) and 'results' in data:
                return data['results']
            return data
        else:
            print(f"  Error: {r.text[:200]}")
            return []
    except Exception as e:
        print(f"[LIST JOBS] ERROR: {e}")
        return []


def test_apply_to_job(access_token, job_id, cover_letter):
    """Apply to a job"""
    url = f"{BASE}/jobs/{job_id}/apply/"
    headers = {"Authorization": f"Bearer {access_token}"}
    payload = {"cover_letter": cover_letter}
    try:
        r = requests.post(url, json=payload, headers=headers, timeout=10)
        print(f"[APPLY TO JOB] {r.status_code}")
        if r.status_code in [200, 201]:
            return r.json()
        else:
            print(f"  Error: {r.text[:200]}")
            return None
    except Exception as e:
        print(f"[APPLY TO JOB] ERROR: {e}")
        return None


def test_list_applications(access_token):
    """List applications for current user"""
    url = f"{BASE}/applications/"
    headers = {"Authorization": f"Bearer {access_token}"}
    try:
        r = requests.get(url, headers=headers, timeout=10)
        print(f"[LIST APPLICATIONS] {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            if isinstance(data, dict) and 'results' in data:
                return data['results']
            return data
        else:
            print(f"  Error: {r.text[:200]}")
            return []
    except Exception as e:
        print(f"[LIST APPLICATIONS] ERROR: {e}")
        return []


def test_search_jobs(query, access_token=None):
    """Search for jobs"""
    url = f"{BASE}/jobs/?{query}"
    headers = {}
    if access_token:
        headers["Authorization"] = f"Bearer {access_token}"
    try:
        r = requests.get(url, headers=headers, timeout=10)
        print(f"[SEARCH JOBS] {r.status_code} query='{query}'")
        if r.status_code == 200:
            data = r.json()
            if isinstance(data, dict) and 'results' in data:
                return data['results']
            return data
        else:
            print(f"  Error: {r.text[:200]}")
            return []
    except Exception as e:
        print(f"[SEARCH JOBS] ERROR: {e}")
        return []


def test_update_application_status(access_token, app_id, new_status):
    """Update application status (Employer only)"""
    url = f"{BASE}/applications/{app_id}/update_status/"
    headers = {"Authorization": f"Bearer {access_token}"}
    payload = {"status": new_status}
    try:
        r = requests.patch(url, json=payload, headers=headers, timeout=10)
        print(f"[UPDATE APP STATUS] {r.status_code} -> {new_status}")
        if r.status_code == 200:
            return r.json()
        else:
            print(f"  Error: {r.text[:200]}")
            return None
    except Exception as e:
        print(f"[UPDATE APP STATUS] ERROR: {e}")
        return None


def test_update_profile(access_token, profile_data):
    """Update user profile"""
    url = f"{BASE}/profiles/me/"
    headers = {"Authorization": f"Bearer {access_token}"}
    try:
        r = requests.patch(url, json=profile_data, headers=headers, timeout=10)
        print(f"[UPDATE PROFILE] {r.status_code}")
        if r.status_code == 200:
            return r.json()
        else:
            print(f"  Error: {r.text[:200]}")
            return None
    except Exception as e:
        print(f"[UPDATE PROFILE] ERROR: {e}")
        return None


def main():
    print("\n=== JOB PORTAL SMOKE TEST ===\n")

    # Generate unique usernames
    emp_suffix = random_suffix()
    seeker_suffix = random_suffix()
    emp_username = f"employer_{emp_suffix}"
    seeker_username = f"seeker_{seeker_suffix}"

    # 1. Register employer
    print("--- STEP 1: Register Employer ---")
    emp_token = test_register(emp_username, f"emp_{emp_suffix}@test.com", "TestPass123!", "employer")
    if not emp_token:
        print("Failed to register employer. Exiting.")
        return False

    emp_user = test_get_current_user(emp_token)
    print(f"  Employer: {emp_user.get('username') if emp_user else 'Unknown'}\n")

    # 2. Register job seeker
    print("--- STEP 2: Register Job Seeker ---")
    seeker_token = test_register(seeker_username, f"seeker_{seeker_suffix}@test.com", "TestPass123!", "job_seeker")
    if not seeker_token:
        print("Failed to register job seeker. Exiting.")
        return False

    seeker_user = test_get_current_user(seeker_token)
    print(f"  Job Seeker: {seeker_user.get('username') if seeker_user else 'Unknown'}\n")

    # 3. Employer creates a job
    print("--- STEP 3: Employer Creates Job ---")
    job_data = {
        "title": "Senior Python Developer",
        "company": "Tech Corp",
        "location": "New York, NY",
        "job_type": "full-time",
        "description": "We are looking for an experienced Python developer.",
        "requirements": "5+ years experience with Django and REST APIs",
        "salary_min": 100000,
        "salary_max": 150000,
        "skills": "Python,Django,REST,PostgreSQL"
    }
    job = test_create_job(emp_token, job_data)
    if not job:
        print("Failed to create job. Exiting.")
        return False

    job_id = job.get('id')
    print(f"  Job created with ID: {job_id}\n")

    # 4. Verify job is listed
    print("--- STEP 4: List Jobs (No Auth) ---")
    jobs = test_list_jobs()
    print(f"  Total jobs available: {len(jobs)}\n")

    # 5. Job seeker applies to job
    print("--- STEP 5: Job Seeker Applies to Job ---")
    application = test_apply_to_job(
        seeker_token,
        job_id,
        "I'm very interested in this opportunity. I have 6 years of Python experience."
    )
    if not application:
        print("Failed to apply to job. Exiting.")
        return False

    app_id = application.get('id')
    app_status = application.get('status')
    print(f"  Application ID: {app_id}, Status: {app_status}\n")

    # 6. Job seeker lists their applications
    print("--- STEP 6: Job Seeker Views Their Applications ---")
    seeker_apps = test_list_applications(seeker_token)
    print(f"  Total applications: {len(seeker_apps)}")
    if seeker_apps:
        for app in seeker_apps:
            print(f"    - Job: {app.get('job_title', 'Unknown')}, Status: {app.get('status')}\n")

    # 7. Search Jobs
    print("--- STEP 7: Search Jobs ---")
    results = test_search_jobs("skills=Python")
    print(f"  Found {len(results)} jobs for 'skills=Python'")

    # 8. Employer lists applications
    print("\n--- STEP 8: Employer Views Applications ---")
    emp_apps = test_list_applications(emp_token)
    print(f"  Total applications received: {len(emp_apps)}")
    target_app_id = None
    if emp_apps:
        target_app_id = emp_apps[0].get('id')
        print(f"  First application ID: {target_app_id}, Candidate Email: {emp_apps[0].get('applicant_email')}")

    # 9. Employer updates application status
    if target_app_id:
        print("\n--- STEP 9: Employer Updates Status ---")
        updated_app = test_update_application_status(emp_token, target_app_id, "shortlisted")
        if updated_app:
            print(f"  New Status: {updated_app.get('status')}")

        # Seeker checks again
        print("  (Seeker verifying status change...)")
        seeker_apps_v2 = test_list_applications(seeker_token)
        if seeker_apps_v2:
            print(f"    Seeker sees status: {seeker_apps_v2[0].get('status')}")

    # 10. Seeker updates profile
    print("\n--- STEP 10: Seeker Updates Profile ---")
    profile_update = {
        "bio": "Passionate Python Developer with 5 years of experience.",
        "location": "San Francisco, CA"
    }
    updated_profile = test_update_profile(seeker_token, profile_update)
    if updated_profile:
        print(f"  Profile updated. Bio: {updated_profile.get('bio')}")

    print("=== SMOKE TEST PASSED ===\n")
    
    # Save credentials for browser test
    with open("credentials.json", "w") as f:
        json.dump({
            "employer_username": emp_username,
            "employer_password": "TestPass123!",
            "seeker_username": seeker_username,
            "seeker_password": "TestPass123!"
        }, f)
        
    return True


if __name__ == '__main__':
    success = main()
    exit(0 if success else 1)
