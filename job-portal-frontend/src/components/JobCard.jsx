import { useNavigate } from "react-router-dom";

export default function JobCard({ job }) {
  const navigate = useNavigate();

  return (
    <div
      className="p-4 bg-white border rounded-lg shadow hover:shadow-lg transition cursor-pointer"
      onClick={() => navigate(`/job/${job.id}`)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-blue-600">{job.title}</h3>
          <p className="text-gray-700 font-medium">{job.company}</p>
          <p className="text-gray-500">{job.location}</p>
        </div>
        <div className="text-right">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
            {job.job_type}
          </span>
        </div>
      </div>
      <p className="mt-3 text-gray-600 line-clamp-2">{job.description}</p>
      <div className="mt-3 flex justify-between items-center">
        <div>
          {job.salary_min && job.salary_max && (
            <p className="text-green-600 font-semibold">
              ₹{job.salary_min} - ₹{job.salary_max}
            </p>
          )}
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          View Details
        </button>
      </div>
    </div>
  );
}