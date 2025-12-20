import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  MapPin,
  Briefcase,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  ArrowRight,
  Clock,
  Building2,
} from "lucide-react";
import apiClient from "../utils/apiClient";

export default function JobsListingPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    location: searchParams.get("location") || "",
    experience: "",
    jobType: "",
    salaryMin: "",
    salaryMax: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const [totalCount, setTotalCount] = useState(0);

  // Items per page is now controlled by server (4), but we can pass it if backend supports it.
  // We'll rely on backend default or response.

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        // Build query params
        const params = {
          page: currentPage,
          search: filters.search || undefined,
          location: filters.location || undefined,
          experience_required: filters.experience || undefined,
          job_type: filters.jobType || undefined,
          salary_min: filters.salaryMin || undefined,
          salary_max: filters.salaryMax || undefined,
        };

        const response = await apiClient.get("/jobs/", { params });

        // Handle paginated response
        if (response.data.results) {
          setJobs(response.data.results);
          setTotalCount(response.data.count);
        } else {
          // Fallback if backend isn't paginated (legacy support)
          setJobs(response.data);
          setTotalCount(response.data.length);
        }

      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [filters, currentPage]);

  const itemsPerPage = 4; // Matching backend PAGE_SIZE
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  // No local slicing needed anymore
  const paginatedJobs = jobs;

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      location: "",
      experience: "",
      jobType: "",
      salaryMin: "",
      salaryMax: "",
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v !== "").length;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Job Listings</h1>
          <p className="text-gray-600 mt-1">
            Found <span className="font-semibold text-[#0A66C2]">{totalCount}</span> job opportunities
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filter Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-20">
              {/* Filter Header */}
              <div className="px-5 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={18} className="text-gray-500" />
                    <h2 className="font-semibold text-gray-900">Filters</h2>
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="text-sm text-[#0A66C2] hover:text-[#004182] font-medium"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Content */}
              <div className="p-5 space-y-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Job title or company"
                      value={filters.search}
                      onChange={(e) => handleFilterChange("search", e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-blue-50 transition-all"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="City or region"
                      value={filters.location}
                      onChange={(e) => handleFilterChange("location", e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-blue-50 transition-all"
                    />
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={filters.experience}
                    onChange={(e) => handleFilterChange("experience", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-blue-50 bg-white transition-all"
                  >
                    <option value="">All Levels</option>
                    <option value="fresher">Fresher/Entry-level</option>
                    <option value="junior">Junior (0-2 years)</option>
                    <option value="mid">Mid-level (2-5 years)</option>
                    <option value="senior">Senior (5-10 years)</option>
                    <option value="expert">Expert (10+ years)</option>
                  </select>
                </div>

                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={filters.jobType}
                    onChange={(e) => handleFilterChange("jobType", e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-blue-50 bg-white transition-all"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range (LPA)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.salaryMin}
                      onChange={(e) => handleFilterChange("salaryMin", e.target.value)}
                      className="w-1/2 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-blue-50 transition-all"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.salaryMax}
                      onChange={(e) => handleFilterChange("salaryMax", e.target.value)}
                      className="w-1/2 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-blue-50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Overlay */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
              <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal size={18} />
                    Filters
                  </h2>
                  <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4 space-y-5">
                  {/* Mobile filter inputs - same as desktop */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                    <input
                      type="text"
                      placeholder="Job title or company"
                      value={filters.search}
                      onChange={(e) => handleFilterChange("search", e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0A66C2]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      placeholder="City or region"
                      value={filters.location}
                      onChange={(e) => handleFilterChange("location", e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0A66C2]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
                    <select
                      value={filters.experience}
                      onChange={(e) => handleFilterChange("experience", e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white"
                    >
                      <option value="">All Levels</option>
                      <option value="fresher">Fresher/Entry-level</option>
                      <option value="junior">Junior (0-2 years)</option>
                      <option value="mid">Mid-level (2-5 years)</option>
                      <option value="senior">Senior (5-10 years)</option>
                      <option value="expert">Expert (10+ years)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <select
                      value={filters.jobType}
                      onChange={(e) => handleFilterChange("jobType", e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white"
                    >
                      <option value="">All Types</option>
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={resetFilters}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium"
                    >
                      Reset
                    </button>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="flex-1 px-4 py-2.5 bg-[#0A66C2] text-white rounded-lg font-medium"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Jobs List */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 shadow-sm"
            >
              <SlidersHorizontal size={18} />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-[#0A66C2] text-white text-xs rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 animate-pulse border border-gray-200">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : paginatedJobs.length > 0 ? (
              <div className="space-y-4">
                {paginatedJobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/job/${job.id}`)}
                    className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 hover:border-[#0A66C2] hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  >
                    {/* Job Header */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-[#0A66C2] transition-colors mb-1">
                          {job.title}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Building2 size={14} />
                          <span className="text-sm font-medium">{job.company_name || job.employer}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 bg-blue-50 text-[#0A66C2] text-xs font-semibold rounded-lg whitespace-nowrap">
                        {job.job_type}
                      </span>
                    </div>

                    {/* Job Meta - Location & Experience */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                        <MapPin size={16} className="text-[#0A66C2]" />
                        <span className="text-sm font-medium text-gray-700">{job.location || "Remote"}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                        <Clock size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-600">{job.experience_required || "Not specified"}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Footer - Salary & CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-green-50 rounded-lg">
                          <IndianRupee size={16} className="text-green-600" />
                          <span className="text-sm font-bold text-green-700">
                            {job.salary_min} - {job.salary_max} LPA
                          </span>
                        </div>
                      </div>
                      <span className="flex items-center gap-1.5 text-[#0A66C2] font-semibold text-sm group-hover:gap-2.5 transition-all">
                        View Details
                        <ArrowRight size={16} />
                      </span>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8 pt-4">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-2.5 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${currentPage === page
                            ? "bg-[#0A66C2] text-white shadow-sm"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                            }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2.5 bg-white border border-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Briefcase size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-[#0A66C2] hover:bg-[#004182] text-white font-medium rounded-lg transition-colors shadow-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
