import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";

const Loader = () => (
  <div className="flex justify-center items-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
  </div>
);

export default function EmployerApplications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosInstance = useAxios();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    // Optional: Redirect logic if needed
    if (!user || (user.profile && user.profile.user_type !== 'employer')) {
      // console.log("User is not employer");
    }
  }, [user]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/api/applications/");

        let appsData = [];
        if (Array.isArray(res.data)) {
          appsData = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          appsData = res.data.results;
        } else if (res.data && typeof res.data === 'object') {
          appsData = [];
        }

        setApplications(appsData);
        setError(null);

        if (appsData.length > 0) {
          setSelectedApp(appsData[0]);
        }
      } catch (err) {
        setApplications([]);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
        } else {
          setError(err.response?.data?.detail || "Failed to load applications");
        }
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [axiosInstance]);

  const updateApplicationStatus = async (appId, newStatus) => {
    try {
      setApplications((prev) =>
        prev.map((app) =>
          app.id === appId ? { ...app, status: newStatus } : app
        )
      );
      if (selectedApp?.id === appId) {
        setSelectedApp(prev => ({ ...prev, status: newStatus }));
      }

      await axiosInstance.patch(`/api/applications/${appId}/update_status/`, {
        status: newStatus,
      });

    } catch (err) {
      console.error("Error updating application:", err);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800 border-gray-200";
    const normalizedStatus = status.toLowerCase();
    const colors = {
      pending: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-100",
      reviewed: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-100",
      shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-100",
      rejected: "bg-rose-50 text-rose-700 border-rose-200 ring-rose-100",
      accepted: "bg-purple-50 text-purple-700 border-purple-200 ring-purple-100",
    };
    return colors[normalizedStatus] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getAbsoluteUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
    const cleanPath = url.startsWith('/') ? url.substring(1) : url;
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.substring(0, baseUrl.length - 1) : baseUrl;
    return `${cleanBase}/${cleanPath}`;
  };

  const filteredApplications = Array.isArray(applications) ? applications.filter(
    (app) => selectedStatus === "all" || (app.status && app.status.toLowerCase() === selectedStatus.toLowerCase())
  ) : [];

  if (loading) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader /></div>;

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50 overflow-hidden font-sans">
      {/* Left Sidebar: Application List */}
      <div className={`w-full md:w-[380px] lg:w-[420px] bg-white border-r border-gray-200 flex flex-col h-full z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] absolute md:relative transform transition-transform duration-300 ease-in-out ${selectedApp ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>

        {/* Header */}
        <div className="p-5 border-b border-gray-100 bg-white z-20 sticky top-0">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Inbox</h2>
              <p className="text-xs text-gray-500 font-medium mt-1">{filteredApplications.length} Applications found</p>
            </div>
            <button onClick={() => navigate('/employer-dashboard')} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          {/* Status Filters */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mask-fade-right">
            {[
              { value: "all", label: "All" },
              { value: "pending", label: "Pending" },
              { value: "shortlisted", label: "Shortlisted" },
              { value: "rejected", label: "Rejected" },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedStatus(filter.value)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${selectedStatus === filter.value
                  ? "bg-gray-900 text-white border-gray-900 shadow-md transform scale-105"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 text-xs font-medium text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50/30 scroll-smooth">
          {filteredApplications.length === 0 ? (
            <div className="text-center py-20 px-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 text-3xl">📭</div>
              <h3 className="text-gray-900 font-semibold mb-1">No applications found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div
                key={app.id || Math.random()}
                onClick={() => setSelectedApp(app)}
                className={`group p-4 rounded-xl cursor-pointer border transition-all duration-200 hover:shadow-md ${selectedApp?.id === app.id
                  ? "bg-white border-indigo-500 shadow-md ring-1 ring-indigo-500/20 z-10 relative"
                  : "bg-white border-gray-200/60 hover:border-indigo-300 hover:bg-white"
                  }`}
              >
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm overflow-hidden flex-shrink-0 ring-2 ring-white">
                      {app.applicant_details?.profile_picture_url ? (
                        <img src={getAbsoluteUrl(app.applicant_details.profile_picture_url)} className="w-full h-full object-cover" alt="" onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = (app.applicant_name || "?").charAt(0) }} />
                      ) : (
                        (app.applicant_name || "?").charAt(0)
                      )}
                    </div>
                    {app.status === 'shortlisted' && <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-0.5">
                      <h3 className={`font-semibold text-sm truncate ${selectedApp?.id === app.id ? 'text-indigo-700' : 'text-gray-900'}`}>
                        {app.applicant_name || "Unknown"}
                      </h3>
                      <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap bg-gray-50 px-2 py-0.5 rounded-full">
                        {app.applied_at ? new Date(app.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ""}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs truncate mb-2">{app.job_title || "Unknown Job"}</p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${getStatusColor(app.status)}`}>
                        {app.status === 'shortlisted' && <span>★ </span>}
                        {app.status || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Main Panel: Review Area */}
      <div className={`flex-1 bg-gray-50/50 h-full overflow-y-auto relative w-full md:w-auto absolute inset-0 md:static z-20 transition-transform duration-300 ${selectedApp ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>

        {selectedApp ? (
          <div className="max-w-5xl mx-auto min-h-full bg-white shadow-xl md:shadow-none flex flex-col">

            {/* Mobile Back Button */}
            <div className="md:hidden p-4 border-b border-gray-100 flex items-center gap-2 text-gray-600 bg-white sticky top-0 z-30" onClick={() => setSelectedApp(null)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              <span className="font-semibold">Back to Inbox</span>
            </div>

            {/* Profile Header */}
            <div className="relative bg-white border-b border-gray-100">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-50 to-indigo-50/50"></div>
              <div className="px-8 pt-20 pb-8 relative z-10">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Avatar */}
                  <div className="w-32 h-32 rounded-2xl bg-white p-1 shadow-lg ring-1 ring-gray-100 -mt-4">
                    <div className="w-full h-full rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center">
                      {selectedApp.applicant_details?.profile_picture_url ? (
                        <img
                          src={getAbsoluteUrl(selectedApp.applicant_details.profile_picture_url)}
                          className="w-full h-full object-cover"
                          alt=""
                          onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerText = (selectedApp.applicant_name || "?").charAt(0) }}
                        />
                      ) : (
                        <div className="text-4xl font-bold text-gray-300">
                          {(selectedApp.applicant_name || "?").charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 mt-2">
                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">{selectedApp.applicant_name || "Unknown Applicant"}</h1>
                        <p className="text-gray-500 font-medium mb-4 flex items-center gap-2">
                          Applied for <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-sm font-semibold">{selectedApp.job_title}</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border shadow-sm ${getStatusColor(selectedApp.status)}`}>
                          {selectedApp.status || "Unknown"}
                        </span>
                        <span className="text-xs text-gray-400 mt-1.5 font-medium">
                          Applied {selectedApp.applied_at ? new Date(selectedApp.applied_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-2">
                      <a href={`mailto:${selectedApp.applicant_email}`} className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-600 rounded-lg text-sm border border-gray-200 hover:border-gray-300 hover:shadow-sm transition font-medium">
                        <span className="text-lg">✉️</span> {selectedApp.applicant_email}
                      </a>
                      {selectedApp.applicant_details?.phone && (
                        <span className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-600 rounded-lg text-sm border border-gray-200 font-medium">
                          <span className="text-lg">📱</span> {selectedApp.applicant_details.phone}
                        </span>
                      )}
                      {selectedApp.applicant_details?.linkedin_url && (
                        <a href={selectedApp.applicant_details.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1.5 bg-[#0A66C2]/5 text-[#0A66C2] rounded-lg text-sm border border-[#0A66C2]/20 hover:bg-[#0A66C2]/10 transition font-medium">
                          <span className="font-bold">in</span> LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-8 flex-1 space-y-8 overflow-y-auto bg-white/50">

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Main Info) */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Bio */}
                  <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                      <span className="text-xl">📝</span>
                      <h3 className="font-bold text-gray-800">Professional Summary</h3>
                    </div>
                    <div className="p-6">
                      {selectedApp.applicant_details?.bio ? (
                        <p className="text-gray-600 text-sm leading-7 whitespace-pre-line">
                          {selectedApp.applicant_details.bio}
                        </p>
                      ) : (
                        <div className="text-center py-6 text-gray-400 italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
                          No professional summary provided.
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Cover Letter */}
                  <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-2 bg-gray-50/30">
                      <span className="text-xl">📨</span>
                      <h3 className="font-bold text-gray-800">Cover Letter</h3>
                    </div>
                    <div className="p-6">
                      {selectedApp.cover_letter ? (
                        <div className="text-gray-700 text-sm leading-7 whitespace-pre-line relative pl-4 border-l-4 border-blue-100 italic">
                          "{selectedApp.cover_letter}"
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-400 italic bg-gray-50 rounded-lg border border-dashed border-gray-200">
                          No cover letter included.
                        </div>
                      )}
                    </div>
                  </section>
                </div>

                {/* Right Column (Meta) */}
                <div className="space-y-6">
                  {/* Skills */}
                  <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.applicant_details?.skills && selectedApp.applicant_details.skills.length > 0 ? (
                        selectedApp.applicant_details.skills.map((skill, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium shadow-sm hover:border-gray-300 transition cursor-default">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm italic">No specific skills listed</p>
                      )}
                    </div>
                  </section>

                  {/* Documents */}
                  <section>
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Documents</h3>
                    <div className="space-y-3">
                      {selectedApp.resume && (
                        <a href={getAbsoluteUrl(selectedApp.resume)} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition group no-underline">
                          <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center mr-3 font-bold text-xs border border-red-100">
                            PDF
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 truncate">Application Resume</p>
                            <p className="text-xs text-gray-400">Targeted for this job</p>
                          </div>
                          <span className="text-gray-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition">→</span>
                        </a>
                      )}
                      {selectedApp.applicant_details?.profile_resume_url && (
                        <a href={getAbsoluteUrl(selectedApp.applicant_details.profile_resume_url)} target="_blank" rel="noopener noreferrer" className="flex items-center p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-400 hover:shadow-md transition group no-underline">
                          <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center mr-3 font-bold text-xs border border-blue-100">
                            CV
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 truncate">Profile Resume</p>
                            <p className="text-xs text-gray-400">General Profile CV</p>
                          </div>
                          <span className="text-gray-300 group-hover:text-indigo-500 transform group-hover:translate-x-1 transition">→</span>
                        </a>
                      )}
                      {!selectedApp.resume && !selectedApp.applicant_details?.profile_resume_url && (
                        <div className="p-4 bg-gray-50 border border-gray-200 border-dashed rounded-xl text-center text-gray-400 text-sm">
                          No documents available
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Experience Level */}
                  {selectedApp.applicant_details?.experience_level && (
                    <section>
                      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Experience</h3>
                      <div className="px-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center gap-3 shadow-sm">
                        <span className="text-2xl">💼</span>
                        <div>
                          <p className="text-sm font-bold text-gray-800">{selectedApp.applicant_details.experience_level}</p>
                          <p className="text-xs text-gray-500">Experience Level</p>
                        </div>
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex flex-col sm:flex-row justify-end gap-3 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] z-20">
              <div className="flex-1 hidden sm:flex items-center">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></div>
                <p className="text-xs text-gray-500 font-medium">Reviewing candidate application</p>
              </div>
              {['pending', 'reviewed'].includes((selectedApp.status || "").toLowerCase()) ? (
                <>
                  <button
                    onClick={() => updateApplicationStatus(selectedApp.id, "shortlisted")}
                    className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span>✓</span> Shortlist
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(selectedApp.id, "rejected")}
                    className="px-6 py-2.5 bg-white text-rose-600 border border-rose-100 font-bold rounded-lg hover:bg-rose-50 hover:border-rose-200 active:scale-95 transition-all flex items-center gap-2"
                  >
                    <span>✗</span> Reject
                  </button>
                </>
              ) : (
                <div className="flex gap-3 items-center bg-gray-50 px-5 py-2 rounded-lg border border-gray-100">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className={`font-bold uppercase text-sm ${getStatusColor(selectedApp.status).split(' ')[1]}`}>{selectedApp.status}</span>
                  <div className="h-4 w-px bg-gray-300 mx-1"></div>
                  <button onClick={() => updateApplicationStatus(selectedApp.id, 'pending')} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline">Change Status</button>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center h-full text-gray-400 bg-white">
            <div className="w-64 h-64 bg-gray-50 rounded-full flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 bg-blue-50 rounded-full animate-ping opacity-20"></div>
              <span className="text-6xl">👈</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Select an Application</h3>
            <p className="text-gray-500 max-w-sm text-center">Choose a candidate from the inbox on the left to view their full profile, resume, and take action.</p>
          </div>
        )}
      </div>
    </div>
  );
}
