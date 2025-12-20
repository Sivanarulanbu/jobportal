import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import Logo from "./Logo";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-xl font-bold text-gray-900 hover:text-[#0A66C2] transition-colors">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 flex items-center justify-center">
              <Logo className="w-full h-full object-cover transform scale-[3.0]" />
            </div>
            <span className="hidden sm:inline pt-1">DreamRoute</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/jobs"
              className="text-gray-600 hover:text-[#0A66C2] font-medium transition-colors"
            >
              Browse Jobs
            </Link>

            {user ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-[#0A66C2] font-medium transition-colors"
                >
                  Saved Jobs
                </Link>

                {/* User Dropdown */}
                <div className="relative group">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:text-[#0A66C2] hover:bg-gray-50 transition-all"
                  >
                    <div className="w-8 h-8 bg-[#0A66C2] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {(user.first_name || user.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">
                      {user.first_name || user.username}
                    </span>
                    <ChevronDown size={16} />
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-1 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-50 hidden group-hover:block">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2.5 text-gray-700 hover:text-[#0A66C2] hover:bg-gray-50 font-medium transition-colors"
                      >
                        Profile Settings
                      </Link>
                      {user.profile?.user_type === "employer" && (
                        <>
                          <Link
                            to="/employer-dashboard"
                            className="block px-4 py-2.5 text-gray-700 hover:text-[#0A66C2] hover:bg-gray-50 font-medium transition-colors"
                          >
                            Dashboard
                          </Link>
                          <Link
                            to="/employer/post-job"
                            className="block px-4 py-2.5 text-gray-700 hover:text-[#0A66C2] hover:bg-gray-50 font-medium transition-colors"
                          >
                            Post a Job
                          </Link>
                        </>
                      )}
                      {user.profile?.user_type === "job_seeker" && (
                        <Link
                          to="/job-seeker-dashboard"
                          className="block px-4 py-2.5 text-gray-700 hover:text-[#0A66C2] hover:bg-gray-50 font-medium transition-colors"
                        >
                          Dashboard
                        </Link>
                      )}
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="px-5 py-2 text-[#0A66C2] font-semibold hover:bg-blue-50 rounded-md transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  className="px-5 py-2 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold rounded-md transition-colors shadow-sm"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-[#0A66C2] p-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-1">
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-gray-700 hover:text-[#0A66C2] hover:bg-gray-50 rounded-md transition-colors font-medium"
              >
                Browse Jobs
              </Link>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2.5 text-gray-700 hover:text-[#0A66C2] hover:bg-gray-50 rounded-md transition-colors font-medium"
                  >
                    Profile
                  </Link>
                  {user.profile?.user_type === "employer" && (
                    <>
                      <Link
                        to="/employer-dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-2.5 text-gray-700 hover:text-[#0A66C2] hover:bg-gray-50 rounded-md transition-colors font-medium"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/employer/post-job"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-2.5 text-gray-700 hover:text-[#0A66C2] hover:bg-gray-50 rounded-md transition-colors font-medium"
                      >
                        Post a Job
                      </Link>
                    </>
                  )}
                  {user.profile?.user_type === "job_seeker" && (
                    <Link
                      to="/job-seeker-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-2.5 text-gray-700 hover:text-[#0A66C2] hover:bg-gray-50 rounded-md transition-colors font-medium"
                    >
                      Dashboard
                    </Link>
                  )}
                  <div className="border-t border-gray-100 my-2"></div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-3 px-4 space-y-2">
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 border border-[#0A66C2] text-[#0A66C2] font-semibold rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold rounded-md transition-colors"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
