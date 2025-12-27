import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { useToast } from "../context/ToastContext";

export default function ProfileDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [profileData, setProfileData] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || "profile");
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
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

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
        const savedData = savedResponse.data.results || savedResponse.data || [];
        setSavedJobs(Array.isArray(savedData) ? savedData : []);

        // Fetch applications
        const applicationsResponse = await apiClient.get("/applications/");
        const appsData = applicationsResponse.data.results || applicationsResponse.data || [];
        setApplications(Array.isArray(appsData) ? appsData : []);
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
      addToast("Resume uploaded successfully!", "success");
    } catch (error) {
      addToast(error.response?.data?.message || "Error uploading resume", "error");
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
      addToast("Profile picture updated!", "success");
    } catch (error) {
      addToast(error.response?.data?.message || "Error uploading profile picture", "error");
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
      addToast("Profile updated successfully!", "success");
      const profileResponse = await apiClient.get("/accounts/job-seekers/my_profile/");
      setProfileData(profileResponse.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      addToast("Failed to update profile.", "error");
    }
  };

  const handleAddSkill = async () => {
    const skill = prompt("Enter a skill to add:");
    if (!skill || !skill.trim()) return;

    const normalizedSkill = skill.trim();
    if (skillsList.some(s => s.toLowerCase() === normalizedSkill.toLowerCase())) {
      addToast("Skill already exists!", "error");
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
      addToast("Skill added!", "success");
    } catch (error) {
      console.error("Error adding skill:", error);
      addToast("Failed to add skill.", "error");
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
      addToast("Skill removed.", "info");
    } catch (error) {
      console.error("Error removing skill:", error);
      addToast("Failed to remove skill.", "error");
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

                {/* Profile Strength Bar */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-800">Profile Strength</h3>
                    <span className="font-bold text-sky-600">
                      {(() => {
                        let strength = 20; // Base strength
                        if (profileData?.profile?.resume) strength += 20;
                        if (profileData?.profile?.skills_list?.length > 0) strength += 15;
                        if (user.first_name && user.last_name) strength += 10;
                        if (formData.headline) strength += 15;
                        if (formData.bio) strength += 10;
                        if (profileData?.profile?.profile_picture) strength += 10;
                        return Math.min(strength, 100);
                      })()}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-sky-500 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${(() => {
                          let strength = 20;
                          if (profileData?.profile?.resume) strength += 20;
                          if (profileData?.profile?.skills_list?.length > 0) strength += 15;
                          if (user.first_name && user.last_name) strength += 10;
                          if (formData.headline) strength += 15;
                          if (formData.bio) strength += 10;
                          if (profileData?.profile?.profile_picture) strength += 10;
                          return Math.min(strength, 100);
                        })()}%`
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Complete your profile to stand out to recruiters by adding skills, resume, and details.
                  </p>
                </div>

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
                    <div className="space-y-4">
                      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <FileText size={24} className="text-red-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {profileData.profile.resume.split('/').pop()}
                          </p>
                          <p className="text-sm text-gray-500">
                            Document Uploaded
                          </p>
                        </div>
                        {/* In-browser preview handling */}
                        {profileData.profile.resume.toLowerCase().endsWith('.pdf') ? (
                          <button
                            onClick={() => {
                              // Create an iframe to view it in modal or new window in a tailored way needed? 
                              // Requirement: In-browser PDF Preview. A simple iframe toggle is best.
                              const pdfUrl = profileData.profile.resume.startsWith('http')
                                ? profileData.profile.resume
                                : `http://localhost:8000${profileData.profile.resume}`;
                              window.open(pdfUrl, '_blank', 'toolbar=0,location=0,menubar=0');
                            }}
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg transition"
                          >
                            Preview PDF
                          </button>
                        ) : (
                          <a
                            href={
                              profileData.profile.resume.startsWith('http')
                                ? profileData.profile.resume
                                : `http://localhost:8000${profileData.profile.resume}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition"
                          >
                            Download
                          </a>
                        )}
                      </div>
                      {/* Inline Preview for PDF */}
                      {profileData.profile.resume.toLowerCase().endsWith('.pdf') && (
                        <div className="w-full h-96 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                          <iframe
                            src={
                              profileData.profile.resume.startsWith('http')
                                ? profileData.profile.resume
                                : `http://localhost:8000${profileData.profile.resume}`
                            }
                            className="w-full h-full"
                            title="Resume Preview"
                          ></iframe>
                        </div>
                      )}
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

                  {/* Active Skills List */}
                  <div className="flex flex-wrap gap-2 mb-6">
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
                      <p className="text-gray-500 italic mb-4">No skills added yet. Add skills to improve your job matches.</p>
                    )}
                  </div>

                  {/* Suggested Skills based on Headline */}
                  {formData.headline && (
                    <div className="bg-sky-50 p-4 rounded-xl border border-sky-100">
                      <p className="text-sm font-bold text-sky-800 mb-3 flex items-center gap-2">
                        <span className="text-lg">💡</span> Suggested for you based on "{formData.headline}"
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(() => {
                          const headlineLower = formData.headline.toLowerCase();
                          const suggestions = {
                            "python": ["Django", "Flask", "FastAPI", "Pandas", "NumPy", "AWS", "PostgreSQL"],
                            "frontend": ["React", "Vue.js", "TypeScript", "Tailwind CSS", "Redux", "Next.js"],
                            "react": ["Redux", "Next.js", "TypeScript", "Tailwind CSS", "Jest"],
                            "full stack": ["Node.js", "React", "MongoDB", "Express", "Docker", "AWS"],
                            "backend": ["Node.js", "Python", "Java", "Go", "SQL", "Redis"],
                            "java": ["Spring Boot", "Hibernate", "Microservices", "Kafka", "AWS"],
                            "data": ["Python", "SQL", "Machine Learning", "Tableau", "Power BI"],
                            "devops": ["Docker", "Kubernetes", "Jenkins", "AWS", "Terraform", "CI/CD"],
                            "designer": ["Figma", "Adobe XD", "Photoshop", "UI/UX", "Prototyping"]
                          };

                          let matchedSuggestions = new Set();
                          Object.keys(suggestions).forEach(key => {
                            if (headlineLower.includes(key)) {
                              suggestions[key].forEach(s => matchedSuggestions.add(s));
                            }
                          });
                          // Add generic fallback if empty but headline exists
                          if (matchedSuggestions.size === 0 && headlineLower.length > 3) {
                            ["Communication", "Teamwork", "Problem Solving", "Git", "Agile"].forEach(s => matchedSuggestions.add(s));
                          }

                          const finalSuggestions = Array.from(matchedSuggestions).filter(s => !skillsList.some(existing => existing.toLowerCase() === s.toLowerCase()));

                          if (finalSuggestions.length === 0) return <p className="text-xs text-sky-600 italic">No specific suggestions found. Try adding generic skills!</p>;

                          return finalSuggestions.slice(0, 8).map(skill => (
                            <button
                              key={skill}
                              onClick={async () => {
                                const newSkills = [...skillsList, skill];
                                try {
                                  await apiClient.put("/accounts/job-seekers/update_profile/", { skills: newSkills.join(",") });
                                  setSkillsList(newSkills); // Optimistic update
                                } catch (e) {
                                  console.error("Failed to add skill", e);
                                }
                              }}
                              className="px-3 py-1 bg-white border border-sky-200 text-sky-700 text-xs font-semibold rounded-full hover:bg-sky-100 hover:border-sky-300 transition flex items-center gap-1"
                            >
                              <Plus size={12} /> {skill}
                            </button>
                          ));
                        })()}
                      </div>
                    </div>
                  )}
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
                  <div className="space-y-6">
                    {applications.map((app) => {
                      // Determine current stage for timeline
                      const status = app.status ? app.status.toLowerCase() : "pending";
                      const stages = [
                        { id: "applied", label: "Applied", completed: true },
                        {
                          id: "reviewed",
                          label: "Resume Viewed",
                          completed: ["reviewed", "shortlisted", "accepted", "rejected"].includes(status)
                        },
                        {
                          id: "decision",
                          label: status === "rejected" ? "Rejected" : (status === "shortlisted" ? "Shortlisted" : (status === "accepted" ? "Accepted" : "Decision")),
                          completed: ["shortlisted", "accepted", "rejected"].includes(status),
                          isError: status === "rejected",
                          isSuccess: ["shortlisted", "accepted"].includes(status)
                        }
                      ];

                      return (
                        <div
                          key={app.id}
                          className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-gray-50/50"
                        >
                          <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
                            <div>
                              <h3 className="font-bold text-xl text-gray-900">
                                {app.job?.title || "Job Title"}
                              </h3>
                              <p className="text-gray-600 font-medium">
                                {app.job?.company_name || "Company"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Applied on {new Date(app.created_at || Date.now()).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider self-start ${status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : status === "shortlisted"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                            >
                              {status || "Pending"}
                            </span>
                          </div>

                          {/* Timeline */}
                          <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto">
                            {/* Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
                            <div
                              className="absolute top-1/2 left-0 h-1 bg-sky-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500"
                              style={{
                                width: status === "pending" ? "0%" :
                                  status === "reviewed" ? "50%" : "100%"
                              }}
                            ></div>

                            {stages.map((stage, index) => (
                              <div key={stage.id} className="flex flex-col items-center gap-2 bg-gray-50 px-2 z-10">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${stage.completed
                                    ? (stage.isError ? "bg-red-500 border-red-500 text-white" : "bg-sky-500 border-sky-500 text-white")
                                    : "bg-white border-gray-300 text-gray-300"
                                    }`}
                                >
                                  {stage.completed ? (
                                    stage.isError ? <X size={16} /> : <div className="text-white font-bold text-xs">✓</div>
                                  ) : (
                                    <span className="text-xs font-bold">{index + 1}</span>
                                  )}
                                </div>
                                <span className={`text-xs font-semibold ${stage.completed
                                  ? (stage.isError ? "text-red-600" : (stage.isSuccess ? "text-green-600" : "text-gray-900"))
                                  : "text-gray-400"
                                  }`}>
                                  {stage.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">
                      You haven't applied to any jobs yet
                    </p>
                    <button
                      onClick={() => navigate('/jobs')}
                      className="mt-4 px-6 py-2 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition"
                    >
                      Browse Jobs
                    </button>
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
