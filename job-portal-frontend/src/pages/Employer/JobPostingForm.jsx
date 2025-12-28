import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { ArrowLeft, Upload, CheckCircle, AlertOctagon } from "lucide-react";

export default function JobPostingForm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosInstance = useAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    job_type: "full-time",
    description: "",
    requirements: "",
    salary_min: "",
    salary_max: "",
    experience_required: "",
    skills: "",
    deadline: ""
  });

  useEffect(() => {
    if (!user || user.profile?.user_type !== 'employer') {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.title || !formData.company || !formData.location || !formData.description || !formData.requirements) {
      setError("Please fill in all required fields (including Requirements)");
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        salary_min: formData.salary_min ? parseFloat(formData.salary_min) : null,
        salary_max: formData.salary_max ? parseFloat(formData.salary_max) : null,
        deadline: formData.deadline ? formData.deadline : null,
        experience_required: formData.experience_required || 'junior',
      };

      await axiosInstance.post("jobs/", payload);

      setSuccess(true);
      setTimeout(() => {
        navigate("/employer-dashboard");
      }, 2000);
    } catch (err) {
      if (err.response?.data && typeof err.response.data === 'object' && !err.response.data.detail) {
        const fieldErrors = Object.entries(err.response.data)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(' ') : value}`)
          .join('\n');
        setError(fieldErrors || "Failed to post job. Please check your inputs.");
      } else {
        setError(err.response?.data?.detail || "Failed to post job. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all duration-200";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="min-h-screen py-8 pb-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white text-center">
            <h1 className="text-3xl font-extrabold mb-1">📝 Post a New Job</h1>
            <p className="text-indigo-100 text-sm">Create a compelling job listing to find your perfect candidate</p>
          </div>

          <div className="p-8 md:p-10">
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
                <AlertOctagon className="flex-shrink-0" size={20} />
                <span className="whitespace-pre-line">{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-3">
                <CheckCircle className="flex-shrink-0" size={20} />
                <span>Job posted successfully! Redirecting...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Core Information Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Core Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>Job Title <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Senior React Developer"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Company Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your company name"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>Location <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. New York, Remote"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Job Type</label>
                    <div className="relative">
                      <select
                        name="job_type"
                        value={formData.job_type}
                        onChange={handleChange}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                      >
                        <option value="full-time">Full-Time</option>
                        <option value="part-time">Part-Time</option>
                        <option value="contract">Contract</option>
                        <option value="internship">Internship</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 pointer-events-none">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compensation Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Compensation</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>Min Salary (LPA)</label>
                    <input
                      type="number"
                      name="salary_min"
                      value={formData.salary_min}
                      onChange={handleChange}
                      placeholder="e.g. 5"
                      step="0.5"
                      min="0"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className={labelClasses}>Max Salary (LPA)</label>
                    <input
                      type="number"
                      name="salary_max"
                      value={formData.salary_max}
                      onChange={handleChange}
                      placeholder="e.g. 12"
                      step="0.5"
                      min="0"
                      className={inputClasses}
                    />
                  </div>
                </div>
              </div>

              {/* Requirements Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Role Description</h2>
                <div>
                  <label className={labelClasses}>Job Description <span className="text-red-500">*</span></label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the role, responsibilities, and team culture..."
                    rows="5"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>Requirements <span className="text-red-500">*</span></label>
                  <textarea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="List key qualifications, skills, and educational requirements..."
                    rows="5"
                    className={inputClasses}
                  />
                </div>
              </div>

              {/* Additional Details Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2">Additional Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClasses}>Experience Level</label>
                    <div className="relative">
                      <select
                        name="experience_required"
                        value={formData.experience_required}
                        onChange={handleChange}
                        className={`${inputClasses} appearance-none cursor-pointer`}
                      >
                        <option value="">Select Level...</option>
                        <option value="fresher">Fresher/Entry-level</option>
                        <option value="junior">Junior (0-2 years)</option>
                        <option value="mid">Mid-level (2-5 years)</option>
                        <option value="senior">Senior (5-10 years)</option>
                        <option value="expert">Expert (10+ years)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 pointer-events-none">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>Application Deadline</label>
                    <input
                      type="date"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClasses}>Required Skills</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g. React, Node.js, Python (comma-separated)"
                    className={inputClasses}
                  />
                  <p className="mt-1 text-xs text-gray-500">Provide a list of skills separated by commas</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/employer-dashboard")}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 order-2 sm:order-1"
                >
                  <ArrowLeft size={18} />
                  Back to Dashboard
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed order-1 sm:order-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Upload size={18} />
                      Post Job
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
