import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      // Remove confirmPassword and set role to PATIENT
      const { confirmPassword, ...dataToSend } = formData;
      dataToSend.role = "PATIENT"; // 👈 hardcoded

      await axios.post("/auth/register", dataToSend);

      // Success – redirect to login
      navigate("/login?registered=true");
    } catch (err) {
      const message =
        err.response?.data?.error || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF9F4] py-12 px-4 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
        .font-display { font-family: 'Space Grotesk', ui-sans-serif, sans-serif; }
        .font-label { font-family: 'IBM Plex Mono', ui-monospace, monospace; }
      `}</style>
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #0f766e14 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative w-full max-w-md">
        <span className="absolute -top-3 left-8 w-3 h-3 rounded-full bg-[#FBF9F4] border border-gray-200 z-10" />
        <span className="absolute -top-3 right-8 w-3 h-3 rounded-full bg-[#FBF9F4] border border-gray-200 z-10" />

        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-5 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-md bg-teal-700 text-white flex items-center justify-center font-label text-lg leading-none">
                ℞
              </span>
              <div>
                <h2 className="font-display font-semibold text-lg text-gray-800 leading-tight">
                  Register as Patient
                </h2>
                <p className="font-label text-[11px] uppercase tracking-wider text-gray-400">
                  Create your patient account
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-5 px-3 py-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="font-label block text-[11px] uppercase tracking-wider text-gray-400 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Dr. John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="font-label block text-[11px] uppercase tracking-wider text-gray-400 mb-1.5"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="font-label block text-[11px] uppercase tracking-wider text-gray-400 mb-1.5"
              >
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="font-label block text-[11px] uppercase tracking-wider text-gray-400 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="font-label block text-[11px] uppercase tracking-wider text-gray-400 mb-1.5"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-700 text-white py-3 rounded-lg font-medium hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading && (
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              )}
              {loading ? "Creating account…" : "Register as Patient"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-teal-700 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>

        <p className="font-label text-center text-[11px] uppercase tracking-widest text-gray-400 mt-5">
          Patient · Store · Government access
        </p>
      </div>
    </div>
  );
};

export default Register;
