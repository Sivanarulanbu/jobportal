import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { Eye, List, Trash2, Activity, MapPin, Briefcase, Calendar, Clock, DollarSign } from "lucide-react";

export default function EmployerJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState({});

  useEffect(() => {
    if (!user || user.profile?.user_type !== 'employer') {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axiosInstance.get("/jobs/my_jobs/");
      setJobs(response.data);
    } catch (err) {
      setError("Failed to fetch your jobs");
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) {
      return;
    }

    setDeleteLoading(prev => ({ ...prev, [jobId]: true }));
    try {
      await axiosInstance.delete(`/jobs/${jobId}/`);
      setJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      setError("Failed to delete job posting");
    } finally {
      setDeleteLoading(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const toggleJobActive = async (jobId, currentStatus) => {
    try {
      const response = await axiosInstance.patch(`/jobs/${jobId}/`, {
        is_active: !currentStatus
      });
      setJobs(prev => prev.map(job => job.id === jobId ? response.data : job));
    } catch (err) {
      setError("Failed to update job status");
    }
  };

  const getBadgeColor = (type) => {
    const colors = {
      full_time: "bg-green-100 text-green-800",
      part_time: "bg-blue-100 text-blue-800",
      contract: "bg-amber-100 text-amber-800",
      internship: "bg-purple-100 text-purple-800",
      temporary: "bg-red-100 text-red-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            💼 My Job Postings
          </h1>
          <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading your job postings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 pb-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            💼 My Job Postings
          </h1>
          <button
            onClick={() => navigate("/employer/post-job")}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <span>➕</span> Post New Job
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="bg-white rounded-xl p-16 text-center border border-gray-200 shadow-sm">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No job postings yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start building your team by posting your first job opportunity. It only takes a few minutes!
            </p>
            <button
              onClick={() => navigate("/employer/post-job")}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
            >
              Post Your First Job
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <div
                key={job.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col p-6 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-1" title={job.title}>
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                      <Briefcase size={14} />
                      <span>{job.company}</span>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded w-fit text-xs font-bold uppercase tracking-wider ${job.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {job.is_active ? "Active" : "Inactive"}
                  </div>
                </div>

                <div className="space-y-2 mb-6 flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={16} />
                    <span>{job.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className={`px-2.5 py-0.5 rounded text-xs font-semibold ${getBadgeColor(job.job_type)}`}>
                      {job.job_type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {job.salary_min && job.salary_max && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign size={16} />
                      <span>{job.salary_min} - {job.salary_max} LPA</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <Calendar size={16} />
                    <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
                  </div>

                  <p className="text-sm text-gray-600 pt-2 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <List size={16} />
                      {job.applications_count || 0} Applications
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/employer/applications?job=${job.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition-colors text-sm"
                      title="View Applications"
                    >
                      <List size={16} /> Apps
                    </button>

                    <button
                      onClick={() => toggleJobActive(job.id, job.is_active)}
                      className={`p-2 rounded-lg transition-colors ${job.is_active ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
                      title={job.is_active ? "Deactivate Job" : "Activate Job"}
                    >
                      <Activity size={18} />
                    </button>

                    <button
                      onClick={() => navigate(`/jobs/${job.id}`)}
                      className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      title="View Public Page"
                    >
                      <Eye size={18} />
                    </button>

                    <button
                      onClick={() => deleteJob(job.id)}
                      disabled={deleteLoading[job.id]}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                      title="Delete Job"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => navigate("/employer-dashboard")}
            className="flex items-center gap-2 text-gray-600 font-semibold hover:text-indigo-600 transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
