import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import About from "../pages/About";
import EmployerDashboard from "../pages/EmployerDashboard";
import JobSeekerDashboard from "../pages/JobSeekerDashboard";
import JobPostingForm from "../pages/Employer/JobPostingForm";
import EmployerApplications from "../pages/Employer/EmployerApplications";
import EmployerJobs from "../pages/Employer/EmployerJobs";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Profile from "../pages/Auth/Profile";

import JobList from "../jobs/JobList";
import JobDetails from "../jobs/JobDetails";
import ApplyJob from "../jobs/ApplyJob";
import SavedJobs from "../jobs/SavedJobs";

import NotFound from "../pages/NotFound";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          {/* DASHBOARDS */}
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/job-seeker-dashboard" element={<JobSeekerDashboard />} />

          {/* EMPLOYER ROUTES */}
          <Route path="/employer/post-job" element={<JobPostingForm />} />
          <Route path="/employer/applications" element={<EmployerApplications />} />
          <Route path="/employer/jobs" element={<EmployerJobs />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />

          {/* JOBS */}
          <Route path="/jobs" element={<JobList />} />
          <Route path="/job/:id" element={<JobDetails />} />
          <Route path="/jobs/:id/apply" element={<ApplyJob />} />

          <Route path="/saved-jobs" element={<SavedJobs />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

