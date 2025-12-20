import { useState } from "react";
import { Search, MapPin, Briefcase, IndianRupee, RotateCcw } from "lucide-react";

export default function SearchBar({ onSearch }) {
  const [filters, setFilters] = useState({
    search: "",
    experience_required: "",
    salary_min: "",
    salary_max: "",
    location: "",
    company: "",
    job_type: "",
    skills: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(filters);
    }
  };

  const handleReset = () => {
    setFilters({
      search: "",
      experience_required: "",
      salary_min: "",
      salary_max: "",
      location: "",
      company: "",
      job_type: "",
      skills: "",
    });
  };

  const inputClasses = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-blue-50 transition-all";
  const selectClasses = "w-full px-4 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 focus:outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-blue-50 transition-all appearance-none cursor-pointer";

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <form onSubmit={handleSearch} className="space-y-5">
        {/* Main Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            name="search"
            placeholder="Search by job title, company, or keywords..."
            value={filters.search}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-[#0A66C2] focus:ring-2 focus:ring-blue-50 transition-all text-base"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience</label>
            <select
              name="experience_required"
              value={filters.experience_required}
              onChange={handleChange}
              className={selectClasses}
            >
              <option value="">All Experience Levels</option>
              <option value="fresher">Fresher/Entry-level</option>
              <option value="junior">Junior (0-2 years)</option>
              <option value="mid">Mid-level (2-5 years)</option>
              <option value="senior">Senior (5-10 years)</option>
              <option value="expert">Expert (10+ years)</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                name="location"
                placeholder="City or region"
                value={filters.location}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-blue-50 transition-all"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Company</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                name="company"
                placeholder="Company name"
                value={filters.company}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-blue-50 transition-all"
              />
            </div>
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type</label>
            <select
              name="job_type"
              value={filters.job_type}
              onChange={handleChange}
              className={selectClasses}
            >
              <option value="">All Job Types</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          {/* Salary Min */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Salary (LPA)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                name="salary_min"
                placeholder="Min"
                value={filters.salary_min}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-blue-50 transition-all"
              />
            </div>
          </div>

          {/* Salary Max */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Salary (LPA)</label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                name="salary_max"
                placeholder="Max"
                value={filters.salary_max}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-blue-50 transition-all"
              />
            </div>
          </div>

          {/* Skills */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Skills</label>
            <input
              type="text"
              name="skills"
              placeholder="e.g., React, Python, JavaScript (comma-separated)"
              value={filters.skills}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 bg-[#0A66C2] hover:bg-[#004182] text-white px-6 py-2.5 rounded-md font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Search size={18} />
            Search Jobs
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-semibold transition-colors flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
