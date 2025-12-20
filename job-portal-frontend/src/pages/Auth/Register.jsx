import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, User, Lock, Briefcase, ArrowRight, CheckCircle2, X } from "lucide-react";
import apiClient from "../../utils/apiClient";
import { useAuth } from "../../hooks/useAuth";
import Logo from "../../components/Logo";

export default function Register() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    user_type: "job_seeker",
    first_name: "",
    last_name: "",
  });

  // Redirect if already logged in
  if (user) {
    navigate("/");
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear errors when user types
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.username || !formData.password || !formData.first_name) {
      setError("Please fill in all required fields.");
      return false;
    }
    if (formData.password !== formData.password_confirm) {
      setError("Passwords do not match.");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    return true;
  };

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    setLoading(true);
    try {
      // 1. Send OTP
      await apiClient.post("/accounts/otp/send_otp/", {
        email: formData.email.trim(),
        purpose: "registration",
      });
      // 2. Show OTP Modal
      setShowOtpModal(true);
    } catch (err) {
      console.error("OTP Error:", err);
      setError(err.response?.data?.message || "Failed to send verification code. Please check your email.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 3. Register with OTP (Backend handles verify + create)
      // Note: If your backend requires explicit verify_otp first, we can do that too, 
      // but usually register_with_otp is sufficient if it takes the code.
      // Based on previous code, we'll try direct registration first.

      const response = await apiClient.post("/accounts/otp/register_with_otp/", {
        ...formData,
        otp_code: otp,
      });

      // Success
      setShowOtpModal(false);
      navigate(response.data.user.user_type === "employer" ? "/employer-dashboard" : "/job-seeker-dashboard");
    } catch (err) {
      console.error("Registration Error:", err);

      let errorMsg = "Registration failed. Please try again.";

      if (err.response?.data) {
        const data = err.response.data;

        // specific message key
        if (data.message) {
          errorMsg = data.message;
        }
        // Django Rest Framework validation errors (e.g. { username: ["Taken"], email: ["Exists"] })
        else if (typeof data === "object") {
          const messages = [];
          for (const [key, value] of Object.entries(data)) {
            const valStr = Array.isArray(value) ? value.join(", ") : String(value);
            // Capitalize key
            const keyName = key.charAt(0).toUpperCase() + key.slice(1);
            messages.push(`${keyName}: ${valStr}`);
          }
          if (messages.length > 0) {
            errorMsg = messages.join(". ");
          }
        }
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-fade-in-up">

        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-between w-2/5 bg-gradient-to-br from-indigo-600 to-violet-700 p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] opacity-10 bg-cover bg-center"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center bg-white/10 p-0 border border-white/20">
                <Logo className="w-full h-full object-cover transform scale-[3.0]" />
              </div>
              <span className="text-3xl font-bold tracking-tight">DreamRoute</span>
            </div>
            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
              Start Your <br /> Journey <span className="text-indigo-200">Today</span>
            </h2>
            <p className="text-indigo-100 text-lg mb-8">
              Join thousands of professionals finding their dream careers and employers finding top talent.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/30 flex items-center justify-center backdrop-blur-sm">
                  <CheckCircle2 size={20} />
                </div>
                <span>Smart Job Matching</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/30 flex items-center justify-center backdrop-blur-sm">
                  <CheckCircle2 size={20} />
                </div>
                <span>Direct Employer Chat</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500/30 flex items-center justify-center backdrop-blur-sm">
                  <CheckCircle2 size={20} />
                </div>
                <span>Premium Profile Features</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-sm text-indigo-200 mt-12">
            © 2025 DreamRoute Inc.
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-3/5 p-8 md:p-12 overflow-y-auto relative">
          <div className="max-w-md mx-auto">
            <div className="md:hidden flex flex-col items-center justify-center mb-6 gap-2">
              <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm">
                <Logo className="w-full h-full object-cover transform scale-[3.0]" />
              </div>
              <span className="text-2xl font-bold text-slate-900">DreamRoute</span>
            </div>

            <div className="text-center md:text-left mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Create an Account</h3>
              <p className="text-slate-500">Fill in your details to get started</p>
            </div>

            {error && !showOtpModal && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm flex items-start">
                <div className="mr-2 mt-0.5">⚠️</div>
                {error}
              </div>
            )}

            <form onSubmit={handleInitialSubmit} className="space-y-5">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">First Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                      name="first_name"
                      type="text"
                      placeholder="John"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-700"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Last Name</label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                      name="last_name"
                      type="text"
                      placeholder="Doe"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-700"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                <div className="relative group">
                  <span className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 font-bold transition-colors">@</span>
                  <input
                    name="username"
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">I am a...</label>
                <div className="relative group">
                  <Briefcase className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                  <select
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="job_seeker">Job Seeker (Looking for jobs)</option>
                    <option value="employer">Employer (Hiring talent)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-700"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm</label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input
                      name="password_confirm"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password_confirm}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium text-slate-700"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:opacity-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? "Processing..." : "Create Account"}
                {!loading && <ArrowRight size={20} />}
              </button>

              <p className="text-center text-slate-500 text-sm mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 relative animate-scale-up">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Check your email</h3>
              <p className="text-slate-500 text-sm">
                We've sent a 6-digit verification code to <br />
                <span className="font-semibold text-slate-700">{formData.email}</span>
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyAndRegister}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                maxLength="6"
                className="w-full text-center text-3xl font-bold tracking-[0.5em] py-4 border-b-2 border-slate-200 focus:border-indigo-600 focus:outline-none transition-colors mb-8 text-slate-800"
                autoFocus
              />

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={handleInitialSubmit}
                disabled={loading}
                className="text-xs text-slate-500 hover:text-indigo-600 font-medium underline"
              >
                Resend Code
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
