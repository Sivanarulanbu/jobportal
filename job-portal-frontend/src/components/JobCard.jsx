import { useNavigate } from "react-router-dom";
import { MapPin, Briefcase, ArrowRight } from "lucide-react";

export default function JobCard({ job }) {
  const navigate = useNavigate();

  const getExperienceLabel = (level) => {
    const labels = {
      fresher: "Fresher/Entry-level",
      junior: "Junior (0-2 yrs)",
      mid: "Mid-level (2-5 yrs)",
      senior: "Senior (5-10 yrs)",
      expert: "Expert (10+ yrs)",
    };
    return labels[level] || level;
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer group relative overflow-hidden"
      onClick={() => navigate(`/job/${job.id}`)}
    >
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#0A66C2] transition-colors truncate">
            {job.title}
          </h3>
          <p className="text-gray-600 text-sm mt-0.5">{job.company}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="inline-block bg-blue-50 text-[#0A66C2] px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap">
            {job.job_type}
          </span>
          {job.experience_required && (
            <span className="inline-block bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap">
              {getExperienceLabel(job.experience_required)}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} />
          <span>{job.location || "Not specified"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Briefcase size={14} />
          <span>{getExperienceLabel(job.experience_required) || "Not specified"}</span>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div>
          {job.salary_min && job.salary_max && (
            <p className="text-gray-900 font-semibold">
              ₹{job.salary_min} - ₹{job.salary_max} LPA
            </p>
          )}
        </div>
        <button className="flex items-center gap-1.5 bg-[#0A66C2] hover:bg-[#004182] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm group-hover:gap-2">
          View Details
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}