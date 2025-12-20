# DreamRoute Job Portal - Architecture & Complete Documentation

## 1. 🏗 System Overview
DreamRoute is a modern, full-stack job portal facilitating connections between Job Seekers and Employers. It features a secure, event-driven architecture with real-time notifications, robust authentication (OTP + JWT), and a premium user interface.

### Tech Stack
- **Frontend**: React.js (Vite), TailwindCSS, Axios
- **Backend**: Django REST Framework (DRF), Python
- **Database**: PostgreSQL (or SQLite for dev)
- **Authentication**: JWT (JSON Web Tokens) + OTP (Email-based)
- **Infrastructure**: SMTP (Gmail) for notifications

---

## 2. 🏛 Architecture Design

### High-Level Data Flow
```mermaid
graph TD
    User[User (Browser)] -->|HTTP/JSON| Frontend[React Frontend]
    Frontend -->|Axios Requests| API[Django REST API]
    API -->|ORM| DB[(Database)]
    API -->|Signals| Async[Signal Handlers]
    Async -->|SMTP| Email[Email Service]
    Email -->|Notifications| User
```

### Signal-Driven Notification System
The backend uses Django Signals to decouple business logic from notification delivery.
- **Trigger**: Database events (save/delete models)
- **Process**: Signal receivers extract context and render HTML templates
- **Output**: Emails sent via SMTP

**Key Signals:**
| Event | Trigger | Action |
|-------|---------|--------|
| User Registration | `post_save(User)` | Send Welcome Email |
| Job Posted | `post_save(Job)` | Notify Employer |
| Application Submitted | `post_save(Application)` | Notify Applicant & Employer |
| Status Update | `post_save(Application)` | Notify Applicant of decision |

---

## 3. 🔐 Authentication & Security

### Dual-Layer Auth System
1.  **JWT Authentication**:
    *   `Access Token`: Short-lived (1 hour) for API access.
    *   `Refresh Token`: Long-lived (1 day) to renew access.
2.  **OTP (One-Time Password)**:
    *   **Registration**: Email verification required via 6-digit OTP.
    *   **Login**: Passwordless login option using Email + OTP.
    *   **Security**: Max 5 attempts, 10-minute expiry, unique constraints.

### User Roles
- **Job Seeker**: Can search jobs, apply, manage profile, track applications.
- **Employer**: Can post jobs, view applications, update status (Pending -> Shortlisted -> Accepted).

---

## 4. 🧩 Backend Architecture (Django)

### App Structure
*   **`accounts/`**: User management, Auth, OTP, Profiles.
    *   `models.py`: `UserProfile` (bio, resume), `OTP` (codes).
    *   `views.py`: Registration, Login, OTP verification.
*   **`jobs/`**: Core business logic.
    *   `models.py`: `Job`, `Application`, `SavedJob`.
    *   `views.py`: Job CRUD, Application handling, Search logic.
    *   `signals.py`: Event listeners for email notifications.
*   **`templates/emails/`**: HTML email templates (Welcome, Job Posted, Status Update).

### Key API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| **Auth** | `/api/accounts/auth/register/` | Register with Password |
| **Auth** | `/api/accounts/otp/login/` | Login via OTP |
| **Jobs** | `/api/jobs/` | List/Create Jobs (Pagination supported) |
| **Jobs** | `/api/jobs/?search=...` | Search by skills, location, title |
| **Apps** | `/api/applications/` | Submit/View Applications |
| **Apps** | `/api/applications/{id}/update_status/` | Employer updates status |

---

## 5. 💻 Frontend Architecture (React)

### Project Structure
*   **`src/pages/`**:
    *   `LandingPage` (Hero, Search), `Login`, `Register`, `Dashboard`.
    *   `Jobs/`: Job Listing, Job Details, Create Job.
*   **`src/components/`**: Reusable UI (Navbar, JobCard, SearchBar).
*   **`src/utils/`**:
    *   `api.js`: Axios instance with interceptors for JWT injection.

### User Flows
1.  **Job Discovery**: Landing Page -> Search Bar -> Job List -> Job Details.
2.  **Application**: Job Details -> "Apply Now" (Modal) -> Success Email.
3.  **Employer**: Admin Panel -> Post Job -> Receive Apps -> Update Candidate Status.

---

## 6. 🗄 Database Schema

*   **User**: Standard Django Auth user.
*   **UserProfile**: Extends User (Resume, Phone, UserType).
*   **Job**: Title, Company, Salary, Skills, Employer(FK).
*   **Application**: Job(FK), Applicant(FK), Status, CoverLetter.
*   **SavedJob**: User(FK), Job(FK).
*   **OTP**: Email, Code, Purpose, Expiry.

---

## 7. ✅ Testing Strategy

The project includes a comprehensive smoke test suite: `smoke_test_full_flow.py`.

**Test Coverage:**
1.  **Registration**: Employer & Job Seeker.
2.  **Job Lifecycle**: Create Job -> Verify Listing.
3.  **Application**: Apply -> Verify Status (Pending).
4.  **Employer Actions**: View Application -> Shortlist Candidate.
5.  **Seeker Actions**: Verify Status Update -> Update Profile.

**Run Tests:**
```bash
python smoke_test_full_flow.py
```

---

## 8. 🚀 Setup & Execution

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend Setup
```bash
cd job-portal
# Create virtual env
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate

# Install dependencies
pip install -r job_portal_backend/requirements.txt

# Run Migrations
python job_portal_backend/manage.py migrate

# Start Server
python job_portal_backend/manage.py runserver
```

### Frontend Setup
```bash
cd job-portal/job-portal-frontend
npm install
npm run dev
```

**Access**:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000/api`
