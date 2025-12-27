import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Heart,
  LogOut,
  Edit,
  Upload,
  Plus,
  X,
} from "lucide-react";
import apiClient from "../utils/apiClient";
import { useAuth } from "../hooks/useAuth";

export default function ProfileDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [skillsList, setSkillsList] = useState([]);
  const [formData, setFormData] = useState({
    phone: "",
    location: "",
    headline: "",
    bio: "",
    // linkedin_url: "", // Add if needed later
    // portfolio_url: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch profile (for job seekers)
        const profileResponse = await apiClient.get("/accounts/job-seekers/my_profile/");
        setProfileData(profileResponse.data);

        // Initialize form data
        if (profileResponse.data?.profile) {
          setFormData({
            phone: profileResponse.data.profile.phone || "",
            location: profileResponse.data.profile.location || "",
            headline: profileResponse.data.profile.headline || "",
            bio: profileResponse.data.profile.bio || "",
          });
          setSkillsList(profileResponse.data.profile.skills_list || []);
        }

        // Fetch saved jobs
        const savedResponse = await apiClient.get("/saved-jobs/");
        setSavedJobs(savedResponse.data || []);

        // Fetch applications
        const applicationsResponse = await apiClient.get("/jobs/my_applications/");
        setApplications(applicationsResponse.data || []);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await apiClient.put("/accounts/job-seekers/update_profile/", formData, {
        headers: { "Content-Type": undefined },
      });
      setShowResumeModal(false);
      // Refetch profile to get updated data
      const profileResponse = await apiClient.get("/accounts/job-seekers/my_profile/");
      setProfileData(profileResponse.data);
      alert("Resume uploaded successfully!");
    } catch (error) {
      alert(error.response?.data?.message || "Error uploading resume");
    }
  };

  const handleProfilePictureUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      await apiClient.put("/accounts/job-seekers/update_profile/", formData, {
        headers: { "Content-Type": undefined },
      });
      // Refetch profile to get updated data
      const profileResponse = await apiClient.get("/accounts/job-seekers/my_profile/");
      setProfileData(profileResponse.data);
      alert("Profile picture updated!");
    } catch (error) {
      alert(error.response?.data?.message || "Error uploading profile picture");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      await apiClient.put("/accounts/job-seekers/update_profile/", formData);
      setEditMode(false);
      alert("Profile updated successfully!");
      const profileResponse = await apiClient.get("/accounts/job-seekers/my_profile/");
      setProfileData(profileResponse.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleAddSkill = async () => {
    const skill = prompt("Enter a skill to add:");
    if (!skill || !skill.trim()) return;

    const normalizedSkill = skill.trim();
    if (skillsList.some(s => s.toLowerCase() === normalizedSkill.toLowerCase())) {
      alert("Skill already exists!");
      return;
    }

    const newSkills = [...skillsList, normalizedSkill];
    const skillsString = newSkills.join(",");

    try {
      await apiClient.put("/accounts/job-seekers/update_profile/", { skills: skillsString });
      // Optimistically update
      setSkillsList(newSkills);
      // Then refresh to be safe
      const profileResponse = await apiClient.get("/accounts/job-seekers/my_profile/");
      setProfileData(profileResponse.data);
      if (profileResponse.data?.profile?.skills_list) {
        setSkillsList(profileResponse.data.profile.skills_list);
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      alert("Failed to add skill.");
    }
  };

  const handleRemoveSkill = async (skillToRemove) => {
    const newSkills = skillsList.filter(skill => skill !== skillToRemove);
    const skillsString = newSkills.join(",");

    try {
      await apiClient.put("/accounts/job-seekers/update_profile/", { skills: skillsString });
      // Optimistically update
      setSkillsList(newSkills);

      const profileResponse = await apiClient.get("/accounts/job-seekers/my_profile/");
      setProfileData(profileResponse.data);
      if (profileResponse.data?.profile?.skills_list) {
        setSkillsList(profileResponse.data.profile.skills_list);
      }
    } catch (error) {
      console.error("Error removing skill:", error);
      alert("Failed to remove skill.");
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="bg-white min-h-screen py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-slate-900 rounded-2xl p-8 mb-8 shadow-lg relative overflow-hidden">
          {/* Background pattern/gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                Welcome, {user.first_name || user.username}!
              </h1>
              <p className="text-slate-300 text-lg font-medium">
                Manage your profile, applications, and saved jobs
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all border border-white/20 backdrop-blur-sm"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              {/* Profile Avatar */}
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  {profileData?.profile?.profile_picture ? (
                    <img
                      src={
                        profileData.profile.profile_picture.startsWith('http')
                          ? profileData.profile.profile_picture
                          : `http://localhost:8000${profileData.profile.profile_picture}`
                      }
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-sky-500"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                      <User size={40} className="text-white" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-sky-600 hover:bg-sky-700 rounded-full flex items-center justify-center cursor-pointer transition">
                    <Upload size={16} className="text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleProfilePictureUpload(e.target.files?.[0])}
                    />
                  </label>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {user.first_name} {user.last_name}
                </h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
              </div>

              {/* Navigation */}
              <div className="space-y-2 border-t border-gray-200 pt-4">
                {[
                  { id: "profile", label: "Profile", icon: User },
                  { id: "applications", label: "Applications", icon: FileText },
                  { id: "saved", label: "Saved Jobs", icon: Heart },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition ${activeTab === id
                      ? "bg-sky-100 text-sky-700"
                      : "text-gray-900 hover:bg-gray-100"
                      }`}
                  >
                    <Icon size={20} />
                    {label}
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="text-center">
                  <p className="text-3xl font-bold text-sky-600">
                    {applications.length}
                  </p>
                  <p className="text-sm text-gray-600">Applications</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-sky-600">
                    {savedJobs.length}
                  </p>
                  <p className="text-sm text-gray-600">Saved Jobs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Profile Information
                    </h2>
                    <button
                      onClick={() => {
                        if (editMode) handleSaveProfile();
                        else setEditMode(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 border border-sky-600 text-sky-600 font-semibold rounded-lg hover:bg-sky-50 transition"
                    >
                      <Edit size={18} />
                      {editMode ? "Save" : "Edit"}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user.first_name}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user.last_name}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Professional Headline
                      </label>
                      <input
                        type="text"
                        name="headline"
                        value={formData.headline}
                        onChange={handleInputChange}
                        placeholder="e.g. Senior Full Stack Developer"
                        disabled={!editMode}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        Profile Summary (Bio)
                      </label>
                      <textarea
                        name="bio"
                        rows="4"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Tell us about yourself..."
                        disabled={!editMode}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 resize-none"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        <MapPin size={18} className="inline mr-2" />
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="City, Country"
                        disabled={!editMode}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100"
                      />
                    </div>

                    <div className="md:col-span-1">
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        <Phone size={18} className="inline mr-2" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+91 XXXXX XXXXX"
                        disabled={!editMode}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Resume Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Resume</h2>
                    {profileData?.profile?.resume && (
                      <div className="flex gap-2">
                        <button className="px-4 py-2 border border-sky-600 text-sky-600 font-semibold rounded-lg hover:bg-sky-50 transition">
                          <Edit size={16} className="inline mr-1" /> Edit
                        </button>
                      </div>
                    )}
                  </div>

                  {profileData?.profile?.resume ? (
                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText size={24} className="text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {profileData.profile.resume.split('/').pop()}
                          </p>
                          <p className="text-sm text-gray-500">
                            {profileData.profile.resume.endsWith('.pdf') ? 'PDF Document' :
                              profileData.profile.resume.endsWith('.doc') ? 'Word Document' :
                                profileData.profile.resume.endsWith('.docx') ? 'Word Document' : 'Document'}
                          </p>
                        </div>
                        <a
                          href={
                            profileData.profile.resume.startsWith('http')
                              ? profileData.profile.resume
                              : `http://localhost:8000${profileData.profile.resume}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition"
                        >
                          View
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-sky-400 transition cursor-pointer"
                      onClick={() => setShowResumeModal(true)}
                    >
                      <Upload size={40} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-lg font-semibold text-gray-900 mb-2">
                        Upload Your Resume
                      </p>
                      <p className="text-gray-600 text-sm">
                        PDF, DOC, or DOCX (Max 5MB)
                      </p>
                    </div>
                  )}

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setShowResumeModal(true)}
                      className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition"
                    >
                      {profileData?.profile?.resume ? 'Change Resume' : 'Upload Resume'}
                    </button>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
                    <button
                      onClick={handleAddSkill}
                      className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition"
                    >
                      <Plus size={18} />
                      Add Skill
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillsList && skillsList.length > 0 ? (
                      skillsList.map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-full font-semibold text-sm flex items-center gap-2"
                        >
                          {skill}
                          <X
                            size={16}
                            className="cursor-pointer hover:text-red-600"
                            onClick={() => handleRemoveSkill(skill)}
                          />
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No skills added yet.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Applications Tab */}
            {activeTab === "applications" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Your Applications
                </h2>
                {applications.length > 0 ? (
                  <div className="space-y-4">
                    {applications.map((app) => (
                      <div
                        key={app.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                      >
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">
                            {app.job?.title || "Job Title"}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {app.job?.company_name || "Company"} •{" "}
                            <span className="capitalize">
                              {app.status || "pending"}
                            </span>
                          </p>
                        </div>
                        <span
                          className={`px-4 py-2 rounded-full font-semibold text-sm ${app.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : app.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                          {app.status || "Pending"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      You haven't applied to any jobs yet
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Saved Jobs Tab */}
            {activeTab === "saved" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Saved Jobs
                </h2>
                {savedJobs.length > 0 ? (
                  <div className="space-y-4">
                    {savedJobs.map((savedJob) => (
                      <div
                        key={savedJob.id}
                        onClick={() => navigate(`/job/${savedJob.job.id}`)}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition cursor-pointer hover:border-sky-400"
                      >
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">
                            {savedJob.job.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {savedJob.job.company_name || savedJob.job.employer_name} • {savedJob.job.location}
                          </p>
                        </div>
                        <span className="text-sky-600 font-semibold">
                          ₹{savedJob.job.salary_min?.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      You haven't saved any jobs yet
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resume Upload Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Upload Resume
            </h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  handleResumeUpload(e.target.files?.[0])
                }
                className="hidden"
                id="resume-input"
              />
              <label htmlFor="resume-input" className="cursor-pointer">
                <Upload size={40} className="mx-auto text-gray-400 mb-4" />
                <p className="text-lg font-semibold text-gray-900 mb-2">
                  Click to upload
                </p>
                <p className="text-gray-600 text-sm">
                  PDF, DOC, or DOCX (Max 5MB)
                </p>
              </label>
            </div>
            <button
              onClick={() => setShowResumeModal(false)}
              className="w-full px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
