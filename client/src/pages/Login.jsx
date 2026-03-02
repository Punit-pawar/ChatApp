import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom"; // 👈 Added Link for the signup route
import { useGoogleAuth } from "../config/GoogleAuth";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiMessageSquare, FiArrowRight } from "react-icons/fi"; // 👈 Added premium icons

/* ================= PREMIUM ANIMATIONS ================= */
const containerAnim = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20, staggerChildren: 0.1 }
  }
};

const itemAnim = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } }
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Google Auth Hook
  const {
    isLoading: googleLoading,
    error: googleError,
    isInitialized,
    signInWithGoogle,
  } = useGoogleAuth();

  const handleGoogleFailure = (error) => {
    console.error("Google login failed:", error);
    toast.error("Google login failed. Please try again.");
  };

  const handleGoogleSuccess = async (userData) => {
    try {
      const toastId = toast.loading("Logging in with Google...", { style: { borderRadius: '12px' } });

      const res = await axios.post(
        "http://localhost:4500/api/user/google-login",
        userData
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Logged in with Google", { id: toastId, icon: "🎉" });
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Google login server error"
      );
    }
  };

  const GoogleLogin = () => {
    signInWithGoogle(handleGoogleSuccess, handleGoogleFailure);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Logging in...", { style: { borderRadius: '12px' } });

    try {
      const res = await axios.post(
        "http://localhost:4500/api/user/login",
        { email, password }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(res.data.message || "Login successful", {
        id: toastId, icon: "✨"
      });

      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] px-4 relative overflow-hidden font-sans selection:bg-primary/30 selection:text-primary"
      style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* High-End Ambient Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary/10 blur-[120px] pointer-events-none animate-pulse delay-1000"></div>

      <div className="w-full max-w-md relative z-10">
        <motion.form
          variants={containerAnim}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="bg-base-100/70 dark:bg-base-100/40 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10"
        >
          <div className="flex flex-col gap-6">
            
            {/* Header Area */}
            <motion.div variants={itemAnim} className="text-center mb-2">
              <div className="mx-auto w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-6">
                <FiMessageSquare className="text-white text-2xl" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-base-content">
                Welcome Back
              </h1>
              <p className="text-base-content/60 font-medium mt-2 text-sm">
                Enter your details to access ChatVerse.
              </p>
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemAnim} className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-base-content/50 uppercase tracking-widest pl-1">
                Email Address
              </label>
              <div className="relative flex items-center group">
                <FiMail className="absolute left-4 text-base-content/40 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-base-100/50 border border-base-content/10 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all font-medium text-sm text-base-content"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemAnim} className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-base-content/50 uppercase tracking-widest pl-1">
                Password
              </label>
              <div className="relative flex items-center group">
                <FiLock className="absolute left-4 text-base-content/40 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-base-100/50 border border-base-content/10 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all font-medium text-sm text-base-content"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            {/* Login Button */}
            <motion.div variants={itemAnim} className="mt-2">
              <button
                type="submit"
                className="group w-full bg-primary hover:bg-primary-focus text-white py-3.5 rounded-xl font-bold tracking-wide shadow-lg shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemAnim} className="divider text-base-content/40 text-xs font-bold uppercase tracking-wider my-0">
              Or continue with
            </motion.div>

            {/* Google Login */}
            <motion.div variants={itemAnim}>
              {googleError ? (
                <button
                  type="button"
                  className="w-full py-3.5 rounded-xl border border-error/30 bg-error/5 text-error font-semibold flex items-center justify-center gap-3 cursor-not-allowed"
                  disabled
                >
                  <FcGoogle className="text-xl" />
                  {googleError}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={GoogleLogin}
                  className="w-full py-3.5 rounded-xl border border-base-content/10 bg-base-100/50 hover:bg-base-200 text-base-content font-semibold flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-sm disabled:opacity-50"
                  disabled={!isInitialized || googleLoading}
                >
                  {googleLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <FcGoogle className="text-2xl" />
                      {isInitialized ? "Sign in with Google" : "Initializing..."}
                    </>
                  )}
                </button>
              )}
            </motion.div>

            {/* Footer Link */}
            <motion.p variants={itemAnim} className="text-center text-sm font-medium text-base-content/60 mt-2">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:text-primary-focus hover:underline font-bold transition-colors">
                Create one now
              </Link>
            </motion.p>

          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;