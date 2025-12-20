import requests
import json

BASE = "http://127.0.0.1:8000/api/accounts/auth"

def try_register(username, email, password):
    url = f"{BASE}/register/"
    payload = {
        "username": username,
        "email": email,
        "password": password,
        "password_confirm": password,
        "user_type": "job_seeker"
    }
    try:
        r = requests.post(url, json=payload, timeout=10)
        print('REGISTER', r.status_code)
        try:
            print(json.dumps(r.json(), indent=2))
        except Exception:
            print(r.text)
        return r
    except Exception as e:
        print('REGISTER ERR', e)
        return None


def try_login(username, password):
    url = f"{BASE}/login/"
    payload = {"username": username, "password": password}
    try:
        r = requests.post(url, json=payload, timeout=10)
        print('LOGIN', r.status_code)
        try:
            print(json.dumps(r.json(), indent=2))
        except Exception:
            print(r.text)
        return r
    except Exception as e:
        print('LOGIN ERR', e)
        return None


def try_me(access_token):
    url = f"{BASE}/current_user/"
    headers = {"Authorization": f"Bearer {access_token}"}
    try:
        r = requests.get(url, headers=headers, timeout=10)
        print('ME', r.status_code)
        try:
            print(json.dumps(r.json(), indent=2))
        except Exception:
            print(r.text)
        return r
    except Exception as e:
        print('ME ERR', e)
        return None


if __name__ == '__main__':
    username = 'apitest_user_cli'
    email = 'apitest_cli@example.com'
    password = 'TestPass123!'

    reg = try_register(username, email, password)
    # If registration failed due to already exists, continue to login
    if reg is None or (reg.status_code >= 400 and reg.status_code != 201 and reg.status_code != 200):
        print('Registration returned error or no response; attempting login anyway')

    login = try_login(username, password)
    if login and login.status_code == 200:
        tokens = login.json().get('tokens') or {}
        access = tokens.get('access')
        if access:
            try_me(access)
        else:
            print('No access token returned in login response')
    else:
        print('Login did not succeed; see above output')
