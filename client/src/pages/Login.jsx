import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleAuth } from "../config/GoogleAuth";
import { FcGoogle } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff, FiMessageSquare } from "react-icons/fi";

const containerAnim = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const itemAnim = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 20 } }
};

/* ===== FLOATING SHAPE ===== */
const Shape = ({ className, style }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${className}`}
    style={style}
    animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
    transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }}
  />
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  const { isLoading: googleLoading, error: googleError, isInitialized, signInWithGoogle } = useGoogleAuth();

  const handleGoogleSuccess = async (userData) => {
    try {
      const id = toast.loading("Signing in with Google...");
      const res = await axios.post("http://localhost:4500/api/user/google-login", userData);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Welcome back! 🎉", { id });
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Google login failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const id = toast.loading("Signing in...");
    try {
      const res = await axios.post("http://localhost:4500/api/user/login", { email, password });
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Welcome back! ✨", { id });
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid credentials", { id });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: "#050811" }}>

      {/* Ambient orbs */}
      <div className="orb w-[500px] h-[500px] top-[-150px] left-[-150px] opacity-25"
        style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }} />
      <div className="orb w-[400px] h-[400px] bottom-[-100px] right-[-100px] opacity-15"
        style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }} />

      {/* Floating decorative shapes */}
      <Shape className="w-64 h-64 border border-primary/10" style={{ top: "15%", right: "10%", borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }} />
      <Shape className="w-32 h-32 border border-accent/10" style={{ bottom: "20%", left: "5%", borderRadius: "50% 50% 50% 50% / 60% 40% 60% 40%" }} />

      {/* HUD grid */}
      <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <motion.div
          variants={containerAnim}
          initial="hidden"
          animate="visible"
          className="glass-card rounded-[2rem] p-8 md:p-10 border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
        >

          {/* Header */}
          <motion.div variants={itemAnim} className="text-center mb-8">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 mx-auto mb-5"
            >
              <FiMessageSquare className="text-white text-2xl" />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-2">Welcome back</h1>
            <p className="text-white/40 text-sm">Sign in to continue to ChatVerse</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <motion.div variants={itemAnim} className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/30">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors duration-200" size={17} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 focus:border-primary focus:bg-white/8 rounded-xl outline-none transition-all duration-200 text-sm text-white placeholder-white/20 font-medium focus:shadow-[0_0_0_4px_rgba(var(--color-primary),0.1)]"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemAnim} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/30">Password</label>
                <button type="button" className="text-[11px] text-primary/70 hover:text-primary transition-colors font-semibold">
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors duration-200" size={17} />
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 focus:border-primary focus:bg-white/8 rounded-xl outline-none transition-all duration-200 text-sm text-white placeholder-white/20 font-medium focus:shadow-[0_0_0_4px_rgba(var(--color-primary),0.1)]"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors"
                >
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemAnim} className="mt-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 30px rgba(var(--color-primary), 0.5)" } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-primary flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                {/* Shimmer on hover */}
                <span className="absolute inset-0 animate-shimmer pointer-events-none opacity-0 group-hover:opacity-100" />
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <>
                    Sign In
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemAnim} className="flex items-center gap-3 my-1">
              <div className="flex-1 h-[1px] bg-white/10" />
              <span className="text-xs text-white/20 font-bold uppercase tracking-widest">or</span>
              <div className="flex-1 h-[1px] bg-white/10" />
            </motion.div>

            {/* Google */}
            <motion.div variants={itemAnim}>
              {googleError ? (
                <div className="w-full py-3.5 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400/50 text-sm font-semibold flex items-center justify-center gap-3">
                  <FcGoogle size={20} /> {googleError}
                </div>
              ) : (
                <motion.button
                  type="button"
                  onClick={() => signInWithGoogle(handleGoogleSuccess, () => toast.error("Google login failed"))}
                  disabled={!isInitialized || googleLoading}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-xl border border-white/10 bg-white/5 text-white font-semibold flex items-center justify-center gap-3 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {googleLoading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <><FcGoogle size={22} /> {isInitialized ? "Continue with Google" : "Initializing..."}</>
                  )}
                </motion.button>
              )}
            </motion.div>

            {/* Footer */}
            <motion.p variants={itemAnim} className="text-center text-sm text-white/30 mt-1">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:text-primary/80 font-bold transition-colors">
                Create one →
              </Link>
            </motion.p>
          </form>
        </motion.div>

        {/* Security badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 flex items-center justify-center gap-2 text-white/20 text-xs"
        >
          🔒 256-bit encrypted · GDPR compliant · Zero logs
        </motion.div>
      </div>
    </div>
  );
};

export default Login;