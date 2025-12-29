import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Briefcase, MapPin, Users, ArrowRight, Building2, TrendingUp, Monitor, Palette, BarChart3, Banknote, GraduationCap, Stethoscope, IndianRupee } from "lucide-react";
import apiClient from "../utils/apiClient";
import { useAuth } from "../hooks/useAuth";
import JobCardSkeleton from "../components/JobCardSkeleton";
import { formatSalary } from "../utils/formatters";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await apiClient.get("/jobs/");
        setFeaturedJobs(response.data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (locationQuery) params.set("location", locationQuery);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="bg-white">
      {/* Hero Section - Light & Airy */}
      <section className="relative bg-gradient-to-br from-[#EBF4FC] via-[#FFFFFF] to-[#F9FAFB] py-16 md:py-24 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Heading */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              Find Your Dream Job <span className="text-[#4A90E2]">Today</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Discover thousands of opportunities from top companies. Your next career move starts here.
            </p>
          </div>

          {/* Central Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-xl border border-gray-100 p-2 md:p-3">
              <div className="flex flex-col md:flex-row gap-2 md:gap-3">
                {/* Job Title Input */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-md bg-gray-50 border border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-[#4A90E2] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                {/* Location Input */}
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-md bg-gray-50 border border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-[#4A90E2] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold rounded-md transition-all shadow-sm hover:shadow-md"
                >
                  Search Jobs
                </button>
              </div>
            </div>
          </form>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <span className="text-gray-500 text-sm">Popular:</span>
            {["Remote", "Full Time", "Engineering", "Marketing", "Design"].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/jobs?search=${tag}`)}
                className="text-sm text-[#4A90E2] hover:text-[#357ABD] hover:underline transition-colors bg-blue-50 px-3 py-1 rounded-full"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                <Briefcase className="text-[#4A90E2]" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">2,500+</p>
              <p className="text-sm text-gray-600">Active Jobs</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                <Building2 className="text-[#4A90E2]" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">500+</p>
              <p className="text-sm text-gray-600">Companies</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                <Users className="text-[#4A90E2]" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">50,000+</p>
              <p className="text-sm text-gray-600">Job Seekers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3">
                <TrendingUp className="text-[#4A90E2]" size={24} />
              </div>
              <p className="text-2xl font-bold text-gray-900">15,000+</p>
              <p className="text-sm text-gray-600">Placements</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Jobs</h2>
              <p className="text-gray-600 mt-1">Latest opportunities from top companies</p>
            </div>
            <button
              onClick={() => navigate("/jobs")}
              className="hidden md:flex items-center gap-2 px-5 py-2.5 border border-[#4A90E2] text-[#4A90E2] font-semibold rounded-md hover:bg-blue-50 transition-colors"
            >
              View All
              <ArrowRight size={18} />
            </button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => navigate(`/job/${job.id}`)}
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#4A90E2] transition-colors truncate">
                        {job.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{job.company_name || job.employer}</p>
                    </div>
                    <span className="ml-3 px-2.5 py-1 bg-blue-50 text-[#4A90E2] text-xs font-medium rounded-md whitespace-nowrap">
                      {job.job_type}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      <span>{job.location || "Location not specified"}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Briefcase size={14} />
                      <span>{job.experience_required || "Experience not specified"}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1 font-semibold text-gray-900">
                      <IndianRupee size={16} />
                      <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                    </div>
                    <span className="text-[#4A90E2] font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Apply <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile View All Button */}
          <div className="text-center mt-8 md:hidden">
            <button
              onClick={() => navigate("/jobs")}
              className="px-6 py-3 bg-[#4A90E2] hover:bg-[#357ABD] text-white font-semibold rounded-md transition-colors shadow-sm"
            >
              View All Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2>
            <p className="text-gray-600 text-lg">Explore jobs in your preferred domain</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Technology", count: "450+ Jobs", icon: Monitor, bgColor: "bg-blue-50", iconBg: "bg-blue-100", textColor: "text-blue-600", iconColor: "text-blue-600" },
              { name: "Design", count: "280+ Jobs", icon: Palette, bgColor: "bg-pink-50", iconBg: "bg-pink-100", textColor: "text-pink-600", iconColor: "text-pink-600" },
              { name: "Marketing", count: "320+ Jobs", icon: BarChart3, bgColor: "bg-orange-50", iconBg: "bg-orange-100", textColor: "text-orange-600", iconColor: "text-orange-600" },
              { name: "Sales", count: "380+ Jobs", icon: Briefcase, bgColor: "bg-emerald-50", iconBg: "bg-emerald-100", textColor: "text-emerald-600", iconColor: "text-emerald-600" },
              { name: "Finance", count: "290+ Jobs", icon: Banknote, bgColor: "bg-yellow-50", iconBg: "bg-yellow-100", textColor: "text-yellow-700", iconColor: "text-yellow-600" },
              { name: "HR", count: "160+ Jobs", icon: Users, bgColor: "bg-blue-50", iconBg: "bg-blue-100", textColor: "text-blue-600", iconColor: "text-blue-600" },
              { name: "Education", count: "220+ Jobs", icon: GraduationCap, bgColor: "bg-indigo-50", iconBg: "bg-indigo-100", textColor: "text-indigo-600", iconColor: "text-indigo-600" },
              { name: "Healthcare", count: "340+ Jobs", icon: Stethoscope, bgColor: "bg-teal-50", iconBg: "bg-teal-100", textColor: "text-teal-600", iconColor: "text-teal-600" },
            ].map((category, index) => (
              <div
                key={index}
                onClick={() => navigate(`/jobs?search=${category.name}`)}
                className="bg-white rounded-lg p-6 text-center cursor-pointer border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-16 h-16 ${category.iconBg} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className={`w-8 h-8 ${category.iconColor}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#4A90E2] transition-colors">{category.name}</h3>
                <p className="text-gray-500 mt-1 font-medium">{category.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#4A90E2] to-[#6BA3E8] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Find Your Next Opportunity?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals and employers on DreamRoute. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/auth")}
              className="px-8 py-3.5 bg-white text-[#4A90E2] font-semibold rounded-md hover:bg-gray-100 transition-colors shadow-sm"
            >
              Get Started Free
            </button>
            <button
              onClick={() => navigate("/jobs")}
              className="px-8 py-3.5 border-2 border-white text-white font-semibold rounded-md hover:bg-white/10 transition-colors"
            >
              Explore Jobs
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
