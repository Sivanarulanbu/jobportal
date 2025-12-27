import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Share2,
  Heart,
  ArrowLeft,
  AlertCircle,
  IndianRupee,
  Loader2,
} from "lucide-react";
import apiClient from "../utils/apiClient";
import { useAuth } from "../hooks/useAuth";
import { formatSalary } from "../utils/formatters";
import { useToast } from "../context/ToastContext";

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await apiClient.get(`/jobs/${id}/`);
        setJob(response.data);
        setIsSaved(response.data.is_saved);
        setIsApplied(response.data.is_applied);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setApplying(true);
      await apiClient.post(`/jobs/${id}/apply/`, { cover_letter: coverLetter });
      setIsApplied(true);
      addToast("Application submitted successfully!", "success");
      setShowApplyModal(false);
    } catch (error) {
      const msg = error.response?.data?.detail || error.response?.data?.error || error.response?.data?.message || "Error applying for job";
      addToast(msg, "error");
    } finally {
      setApplying(false);
    }
  };

  const toggleSaveJob = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const response = await apiClient.post(`/jobs/${id}/save/`, {});
      setIsSaved(response.data.is_saved);
      addToast(response.data.is_saved ? "Job saved to your profile!" : "Job removed from saved jobs.", "success");
    } catch (error) {
      console.error("Error saving job:", error);
      addToast("Failed to update saved status.", "error");
    }
  };

  if (loading) {
    return (
      <div className="bg-blue-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-64 bg-blue-200 rounded-lg"></div>
            <div className="h-12 bg-blue-200 rounded w-1/2"></div>
            <div className="h-6 bg-blue-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-blue-50 min-h-screen py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg p-12 text-center">
            <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
            <p className="text-gray-600 mb-6">
              The job you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/jobs")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Back to Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/jobs")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6"
        >
          <ArrowLeft size={20} />
          Back to Jobs
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-gray-600">{job.company_name || job.employer}</p>
                </div>
                <span className="px-4 py-2 bg-blue-100 text-blue-700 font-semibold rounded-full">
                  {job.job_type}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <MapPin className="text-blue-600" size={20} />
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">
                      Location
                    </p>
                    <p className="font-semibold text-gray-900">
                      {job.location || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <IndianRupee className="text-blue-600" size={20} />
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">
                      Salary
                    </p>
                    <p className="font-semibold text-gray-900">
                      {formatSalary(job.salary_min, job.salary_max)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Briefcase className="text-blue-600" size={20} />
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">
                      Experience
                    </p>
                    <p className="font-semibold text-gray-900">
                      {job.experience_required || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="text-blue-600" size={20} />
                  <div>
                    <p className="text-xs text-gray-600 uppercase tracking-wide">
                      Posted
                    </p>
                    <p className="font-semibold text-gray-900">Recently</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Requirements
                </h2>
                <div className="prose prose-sm max-w-none text-gray-700">
                  <p className="whitespace-pre-wrap">{job.requirements}</p>
                </div>
              </div>
            )}

            {/* Skills */}
            {job.skills && (
              <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.split(",").map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Company Info */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                About the Company
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-gray-600 mb-4">
                    {job.company_description ||
                      "A great company offering amazing opportunities for growth and development."}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold text-gray-900">Industry:</span> Technology
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">Size:</span> 500-1000
                    employees
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Button */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-6">
              <button
                onClick={() => setShowApplyModal(true)}
                disabled={isApplied}
                className={`w-full px-6 py-3 font-bold rounded-lg transition mb-4 ${isApplied ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700 text-white'}`}
              >
                {isApplied ? "Applied" : "Apply Now"}
              </button>

              <div className="space-y-3">
                <button
                  onClick={toggleSaveJob}
                  className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition border-2 ${isSaved
                    ? "bg-red-50 border-red-300 text-red-600"
                    : "border-gray-300 text-gray-900 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                >
                  <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
                  {isSaved ? "Saved" : "Save Job"}
                </button>

                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition">
                  <Share2 size={20} />
                  Share Job
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3 text-sm">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">Job ID:</span> #{job.id}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">Applications:</span> 45+
                </p>
              </div>
            </div>

            {/* Similar Jobs */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Similar Jobs</h3>
              <div className="space-y-3">
                {[
                  "Senior Developer - Remote",
                  "Junior Frontend Engineer",
                  "Full Stack Developer",
                ].map((title, index) => (
                  <button
                    key={index}
                    onClick={() => window.scrollTo(0, 0)}
                    className="block w-full text-left p-3 hover:bg-gray-50 rounded-lg transition border border-gray-200"
                  >
                    <p className="font-semibold text-gray-900 text-sm hover:text-sky-600">
                      {title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Apply for {job.title}
            </h2>
            <p className="text-gray-600 mb-6">
              Ready to apply for this position? You can optionally add a cover letter.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Why are you a good fit for this role?"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-32 resize-none"
                />
              </div>
              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 disabled:bg-teal-400"
              >
                {applying && <Loader2 size={18} className="animate-spin" />}
                {applying ? "Submitting..." : "Confirm Application"}
              </button>
              <button
                onClick={() => setShowApplyModal(false)}
                disabled={applying}
                className="w-full px-6 py-3 border-2 border-gray-300 text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
