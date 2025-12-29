import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user || user.profile?.user_type !== 'employer') {
      navigate("/login");
    }
  }, [user, navigate]);

  const features = [
    {
      icon: "📋",
      title: "Post a New Job",
      description: "Create and publish job listings to attract qualified candidates",
      action: () => navigate("/employer/post-job")
    },
    {
      icon: "👥",
      title: "View Applications",
      description: "Review applications and manage candidate responses",
      action: () => navigate("/employer/applications")
    },
    {
      icon: "💼",
      title: "Manage Postings",
      description: "Edit, update, or close your active job listings",
      action: () => navigate("/employer/jobs")
    },
    {
      icon: "🎯",
      title: "Find Talent",
      description: "Search and filter candidates by skills and experience",
      action: () => navigate("/jobs")
    },
    {
      icon: "📊",
      title: "Analytics",
      description: "Track job performance and application statistics",
      action: () => alert("Analytics feature coming soon!")
    },
    {
      icon: "✉️",
      title: "Communicate",
      description: "Message candidates and schedule interviews directly",
      action: () => alert("Messaging feature coming soon!")
    }
  ];

  return (
    <div className="min-h-[calc(100vh-200px)] py-8 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="py-16 px-4 md:px-8 text-center bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-purple-600 tracking-tight">
            Welcome, {user?.user?.first_name || user?.username}! 👔
          </h1>
          <p className="text-gray-600 text-lg md:text-xl font-medium mb-8 max-w-2xl mx-auto">
            Manage your job postings, review applications, and find the right talent
          </p>
          <button
            onClick={() => navigate("/employer/post-job")}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-base md:text-lg"
          >
            ➕ Post New Job
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {features.map((feature, index) => (
          <div
            key={index}
            onClick={feature.action}
            className="group p-8 bg-gradient-to-br from-white to-blue-50/50 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-indigo-600 transition-colors">
              {feature.title}
            </h3>
            <p className="text-gray-600 leading-relaxed group-hover:text-gray-700">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
