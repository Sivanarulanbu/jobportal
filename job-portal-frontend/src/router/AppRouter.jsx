import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

import MainLayout from "../layouts/MainLayout";

// New Professional Pages
import LandingPage from "../pages/LandingPage";
import JobsListingPage from "../pages/JobsListingPage";
import JobDetailsPage from "../pages/JobDetailsPage";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import OTPLogin from "../pages/Auth/OTPLogin";
import ProfileDashboard from "../pages/ProfileDashboard";

// Old Pages (keeping for reference)
import About from "../pages/About";
import EmployerDashboard from "../pages/EmployerDashboard";
import JobSeekerDashboard from "../pages/JobSeekerDashboard";
import JobPostingForm from "../pages/Employer/JobPostingForm";
import EmployerApplications from "../pages/Employer/EmployerApplications";
import EmployerJobs from "../pages/Employer/EmployerJobs";

import NotFound from "../pages/NotFound";

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing & Jobs Pages (with layout) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/jobs" element={<JobsListingPage />} />
            <Route path="/job/:id" element={<JobDetailsPage />} />
            <Route path="/profile" element={<ProfileDashboard />} />
            <Route path="/about" element={<About />} />
          </Route>

          {/* Auth Pages (without layout) */}
          {/* Auth Pages (without layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp-login" element={<OTPLogin />} />
          <Route path="/auth" element={<Login />} />

          {/* Dashboards */}
          <Route element={<MainLayout />}>
            <Route path="/employer-dashboard" element={<EmployerDashboard />} />
            <Route path="/job-seeker-dashboard" element={<JobSeekerDashboard />} />

            {/* Employer Routes */}
            <Route path="/employer/post-job" element={<JobPostingForm />} />
            <Route path="/employer/applications" element={<EmployerApplications />} />
            <Route path="/employer/jobs" element={<EmployerJobs />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

