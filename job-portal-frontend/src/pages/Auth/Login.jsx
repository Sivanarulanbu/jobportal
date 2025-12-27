import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../components/Logo";
import { Loader2 } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export default function Login() {
  const { login, user } = useAuth();
  const nav = useNavigate();
  const { addToast } = useToast();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      console.log("User already logged in, redirecting to home");
      nav("/");
    }
  }, [user, nav]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username.trim() || !form.password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    try {
      setLoading(true);
      console.log("Starting login...");
      await login({ username: form.username, password: form.password });
      addToast("Successfully signed in!", "success");
      console.log("Login successful, redirecting...");

      // Give it a moment to ensure state is updated
      setTimeout(() => {
        nav("/");
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      const errorMsg = err.response?.data?.message || err.message || "Login failed. Please check your credentials.";
      setError(errorMsg);
      addToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 py-6 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 transition-all duration-300 my-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center border border-gray-100 shadow-sm">
              <Logo className="w-full h-full object-cover transform scale-[3.0]" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">DreamRoute</h1>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1">
            Sign In
          </h2>
          <p className="text-slate-500 text-sm font-medium">Your Gateway to Dream Career</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl text-sm font-medium animate-pulse border-l-4 border-l-red-500">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Email or Username</label>
            <input
              type="text"
              placeholder="Enter your email or username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 font-medium text-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 font-medium text-slate-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:opacity-95 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed mt-2 flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center text-slate-500 text-sm font-medium">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-700 hover:underline font-bold transition-colors"
          >
            Create one here
          </Link>
        </div>
      </div>
    </div>
  );
}
