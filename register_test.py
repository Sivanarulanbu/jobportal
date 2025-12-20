import requests
import json

url = 'http://127.0.0.1:8000/api/accounts/auth/register/'
payload = {
    "username": "apitestuser3",
    "email": "apitest3@example.com",
    "password": "TestPass123!",
    "password_confirm": "TestPass123!",
    "user_type": "job_seeker"
}

try:
    r = requests.post(url, json=payload, timeout=10)
    print('STATUS:', r.status_code)
    try:
        print('BODY:', json.dumps(r.json(), indent=2))
    except Exception:
        print('BODY_TEXT:', r.text)
except Exception as e:
    print('REQUEST ERROR:', e)
