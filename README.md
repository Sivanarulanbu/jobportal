# Job Portal (Django + React)

This repository contains a Django backend and a React frontend (Vite).

Quick start (development):

1. Backend (Django)

```powershell
cd C:\Users\Dell\job-portal\job_portal_backend
py -3 -m venv .venv; .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt  # if requirements.txt exists
py -3 manage.py makemigrations --noinput
py -3 manage.py migrate --noinput
py -3 manage.py runserver
```

2. Frontend (Vite + React)

```powershell
cd C:\Users\Dell\job-portal\job-portal-frontend
# copy .env.example to .env and edit VITE_API_URL if needed
# On Windows PowerShell:
cp .env.example .env
npm install
npm run dev
```

- The React dev server typically runs on `http://localhost:5173` but may try other ports if 5173 is busy.
- The frontend uses `VITE_API_URL` (default `http://localhost:8000/api`) to call the Django backend.

Production build steps (serve build with Django):

1. In frontend:

```powershell
npm run build
```

2. Copy the generated `build/` folder into the Django project root (where `manage.py` lives) and then run `py -3 manage.py collectstatic` if needed.

If you'd like, I can:
- Commit these changes for you (already committed backend change earlier).
- Add a `.env` loader to the README with an example for Windows/PowerShell.
- Set up a simple script to build frontend automatically and copy to backend `build/` folder.
