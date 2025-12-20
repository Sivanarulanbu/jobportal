import requests
import json
import time

BASE_URL = "http://localhost:8000/api"

def test_otp_flow():
    """Test complete OTP authentication flow"""
    print("=" * 60)
    print("Testing OTP Authentication Flow")
    print("=" * 60)
    
    test_email = "otp_test_user@example.com"
    test_otp = None
    
    # Step 1: Send OTP for registration
    print("\n1️⃣  SENDING OTP FOR REGISTRATION")
    print("-" * 60)
    response = requests.post(f"{BASE_URL}/accounts/otp/send_otp/", json={
        "email": test_email,
        "purpose": "registration"
    })
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("✅ OTP sent successfully!")
        # For testing, we'll fetch the OTP from database
        # In production, user would receive via email
        from job_portal_backend.accounts.models import OTP
        otp_obj = OTP.objects.filter(email=test_email, purpose="registration").first()
        if otp_obj:
            test_otp = otp_obj.otp_code
            print(f"📧 Test OTP code: {test_otp}")
    else:
        print(f"❌ Failed to send OTP: {response.text}")
        return
    
    time.sleep(1)
    
    # Step 2: Verify OTP
    print("\n2️⃣  VERIFYING OTP")
    print("-" * 60)
    response = requests.post(f"{BASE_URL}/accounts/otp/verify_otp/", json={
        "email": test_email,
        "otp_code": test_otp,
        "purpose": "registration"
    })
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 200:
        print("✅ OTP verified successfully!")
    else:
        print(f"❌ Failed to verify OTP: {response.text}")
        return
    
    time.sleep(1)
    
    # Step 3: Register with OTP
    print("\n3️⃣  REGISTERING WITH OTP")
    print("-" * 60)
    response = requests.post(f"{BASE_URL}/accounts/otp/register_with_otp/", json={
        "username": "otp_test_user",
        "email": test_email,
        "password": "SecurePass123!",
        "password_confirm": "SecurePass123!",
        "otp_code": test_otp,
        "user_type": "job_seeker",
        "first_name": "OTP",
        "last_name": "Tester"
    })
    print(f"Status: {response.status_code}")
    data = response.json()
    if "tokens" in data:
        tokens_display = {
            "access": data["tokens"]["access"][:30] + "...",
            "refresh": data["tokens"]["refresh"][:30] + "..."
        }
        print(f"Response: {json.dumps({**data, 'tokens': tokens_display}, indent=2)}")
    else:
        print(f"Response: {json.dumps(data, indent=2)}")
    
    if response.status_code == 201:
        print("✅ Registration with OTP successful!")
        access_token = data["tokens"]["access"]
    else:
        print(f"❌ Failed to register: {response.text}")
        return
    
    time.sleep(1)
    
    # Step 4: Test OTP Login
    print("\n4️⃣  TESTING OTP LOGIN")
    print("-" * 60)
    
    # Send OTP for login
    response = requests.post(f"{BASE_URL}/accounts/otp/send_otp/", json={
        "email": test_email,
        "purpose": "login"
    })
    print(f"Send OTP Status: {response.status_code}")
    
    if response.status_code == 200:
        # Get new OTP code
        from job_portal_backend.accounts.models import OTP
        otp_obj = OTP.objects.filter(email=test_email, purpose="login").first()
        if otp_obj:
            login_otp = otp_obj.otp_code
            print(f"📧 Test Login OTP code: {login_otp}")
            
            time.sleep(1)
            
            # Login with OTP
            response = requests.post(f"{BASE_URL}/accounts/otp/login_with_otp/", json={
                "email": test_email,
                "otp_code": login_otp
            })
            print(f"Login Status: {response.status_code}")
            data = response.json()
            if "tokens" in data:
                tokens_display = {
                    "access": data["tokens"]["access"][:30] + "...",
                    "refresh": data["tokens"]["refresh"][:30] + "..."
                }
                print(f"Response: {json.dumps({**data, 'tokens': tokens_display}, indent=2)}")
            else:
                print(f"Response: {json.dumps(data, indent=2)}")
            
            if response.status_code == 200:
                print("✅ OTP Login successful!")
            else:
                print(f"❌ Failed to login: {response.text}")
    
    print("\n" + "=" * 60)
    print("OTP FLOW TEST COMPLETED ✅")
    print("=" * 60)

def test_invalid_otp():
    """Test with invalid OTP"""
    print("\n\nTesting Invalid OTP Attempts")
    print("=" * 60)
    
    test_email = "invalid_otp_test@example.com"
    
    # Send OTP
    response = requests.post(f"{BASE_URL}/accounts/otp/send_otp/", json={
        "email": test_email,
        "purpose": "registration"
    })
    
    if response.status_code == 200:
        print("✅ OTP sent for invalid attempt testing")
        
        # Try with invalid OTP
        response = requests.post(f"{BASE_URL}/accounts/otp/verify_otp/", json={
            "email": test_email,
            "otp_code": "000000",
            "purpose": "registration"
        })
        print(f"\nInvalid OTP Response Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 400:
            print("✅ System correctly rejected invalid OTP")
        else:
            print("❌ Unexpected response for invalid OTP")
    
    print("=" * 60)

if __name__ == "__main__":
    try:
        test_otp_flow()
        test_invalid_otp()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
