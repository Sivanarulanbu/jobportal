import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import Loader from "./Loader";

export default function ApplicationTracker() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/applications/");
        setApplications(res.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load applications");
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      reviewed: "bg-blue-100 text-blue-800",
      shortlisted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      accepted: "bg-purple-100 text-purple-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      reviewed: "👁️",
      shortlisted: "✅",
      rejected: "❌",
      accepted: "🎉",
    };
    return icons[status] || "📋";
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">My Applications</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="bg-gray-100 rounded-lg p-12 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Applications Yet</h3>
          <p className="text-gray-600">You haven't applied to any jobs yet. Start exploring opportunities!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition p-5"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-blue-600">{app.job_title}</h3>
                  <p className="text-gray-600 text-sm">Applied on {new Date(app.applied_at).toLocaleDateString()}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${getStatusColor(app.status)}`}>
                  {getStatusIcon(app.status)} {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </span>
              </div>

              <div className="mt-4 bg-gray-50 rounded p-3">
                <p className="text-gray-700 text-sm"><strong>Cover Letter:</strong></p>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{app.cover_letter}</p>
              </div>

              {app.resume && (
                <div className="mt-3">
                  <a
                    href={app.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-semibold inline-flex items-center gap-1"
                  >
                    📄 View Resume
                  </a>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                Last updated: {new Date(app.updated_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
