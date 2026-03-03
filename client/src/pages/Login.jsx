import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleAuth } from "../config/GoogleAuth";
import { FcGoogle } from "react-icons/fc";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff,
  FiMessageSquare, FiZap, FiShield, FiUsers, FiStar
} from "react-icons/fi";

/* ============================================================
   PARTICLE SYSTEM
   ============================================================ */
const useParticles = (count = 18) => {
  const [particles] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 8,
      opacity: 0.15 + Math.random() * 0.4,
    }))
  );
  return particles;
};

/* ============================================================
   LEFT PANEL FEATURES
   ============================================================ */
const features = [
  { icon: FiZap, text: "Real-time messaging" },
  { icon: FiShield, text: "End-to-end encrypted" },
  { icon: FiUsers, text: "Group chats & communities" },
  { icon: FiStar, text: "Premium experience" },
];

const testimonials = [
  { text: "The best chat app I've ever used. Incredibly fast!", name: "Sarah K.", avatar: "SK" },
  { text: "Beautiful UI and lightning-fast. Absolutely love it!", name: "Alex M.", avatar: "AM" },
  { text: "Finally a chat app that just works perfectly.", name: "Jordan R.", avatar: "JR" },
];

/* ============================================================
   FLOATING ORB (left panel)
   ============================================================ */
const FloatingOrb = ({ style, className }) => (
  <motion.div
    className={`absolute rounded-full pointer-events-none ${className}`}
    style={style}
    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 6 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }}
  />
);

/* ============================================================
   TYPING INDICATOR
   ============================================================ */
const TypingDots = () => (
  <div className="flex gap-1 items-center">
    {[0, 1, 2].map(i => (
      <motion.div
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-white/60"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
      />
    ))}
  </div>
);

/* ============================================================
   LOGIN COMPONENT
   ============================================================ */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const navigate = useNavigate();

  const particles = useParticles(20);

  const { isLoading: googleLoading, error: googleError, isInitialized, signInWithGoogle } = useGoogleAuth();

  // Rotate testimonials
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(i => (i + 1) % testimonials.length), 4000);
    return () => clearInterval(t);
  }, []);

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
    <div className="min-h-screen flex overflow-hidden" style={{ background: "#060912" }}>

      {/* ===== LEFT PANEL ===== */}
      <div className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1a0533 40%, #0b1340 100%)" }}>

        {/* Floating particles */}
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              background: p.id % 3 === 0 ? "#a855f7" : p.id % 3 === 1 ? "#3b82f6" : "#06b6d4",
              opacity: p.opacity,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.sin(p.id) * 20, 0],
              opacity: [p.opacity, p.opacity * 1.8, p.opacity],
            }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Ambient gradient orbs */}
        <FloatingOrb
          className="w-[450px] h-[450px] blur-[120px]"
          style={{ background: "radial-gradient(circle, rgba(168,85,247,0.25), transparent 70%)", top: "-10%", left: "-15%" }}
        />
        <FloatingOrb
          className="w-[350px] h-[350px] blur-[100px]"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.2), transparent 70%)", bottom: "5%", right: "-10%" }}
        />
        <FloatingOrb
          className="w-[250px] h-[250px] blur-[80px]"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,0.15), transparent 70%)", top: "50%", left: "50%" }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }} />

        {/* Diagonal separator */}
        <div className="absolute right-0 inset-y-0 w-16 pointer-events-none" style={{
          background: "linear-gradient(to right, transparent, #060912)"
        }} />

        {/* Top section — Logo + tagline */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}>
              <FiMessageSquare className="text-white" size={20} />
            </div>
            <span className="text-white font-black text-xl tracking-tight">ChatVerse</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
            Connect with<br />
            <span style={{
              background: "linear-gradient(135deg, #a855f7, #3b82f6, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundSize: "200% 200%",
              animation: "gradientShift 4s ease infinite"
            }}>
              the world
            </span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed max-w-sm">
            Real-time conversations, beautifully designed for the modern era.
          </p>
        </motion.div>

        {/* Middle section — Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative z-10 space-y-4"
        >
          {features.map(({ icon: Icon, text }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}>
                <Icon className="text-purple-400" size={14} />
              </div>
              <span className="text-white/70 text-sm font-medium">{text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom section — Testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10"
        >
          <div className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} size={12} className="text-yellow-400 fill-current" style={{ fill: "#facc15" }} />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-4 italic">
                  "{testimonials[testimonialIdx].text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}>
                    {testimonials[testimonialIdx].avatar}
                  </div>
                  <span className="text-white/50 text-xs font-semibold">{testimonials[testimonialIdx].name}</span>
                  <div className="ml-auto">
                    <TypingDots />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex gap-1.5 mt-4">
              {testimonials.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ width: i === testimonialIdx ? 16 : 6, opacity: i === testimonialIdx ? 1 : 0.3 }}
                  className="h-1.5 rounded-full bg-purple-400"
                />
              ))}
            </div>
          </div>

          <p className="text-white/20 text-xs text-center mt-4">
            🔒 256-bit encrypted · GDPR compliant · Zero logs
          </p>
        </motion.div>
      </div>

      {/* ===== RIGHT PANEL — FORM ===== */}
      <div className="flex-1 flex items-center justify-center px-5 py-12 relative"
        style={{ background: "#060912" }}>

        {/* Mobile background */}
        <div className="absolute inset-0 lg:hidden pointer-events-none overflow-hidden">
          <div className="absolute w-[500px] h-[500px] top-[-200px] right-[-200px] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)" }} />
          <div className="absolute w-[400px] h-[400px] bottom-[-150px] left-[-150px] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15), transparent 70%)" }} />
        </div>

        <div className="w-full max-w-[420px] relative z-10">

          {/* Mobile logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex lg:hidden items-center justify-center gap-3 mb-8"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}>
              <FiMessageSquare className="text-white" size={18} />
            </div>
            <span className="text-white font-black text-xl">ChatVerse</span>
          </motion.div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderRadius: "1.75rem",
              boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)"
            }}
            className="p-8"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-white tracking-tight">Welcome back</h1>
                <span className="text-xl">👋</span>
              </div>
              <p className="text-white/40 text-sm">Sign in to your ChatVerse account</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-2"
              >
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">
                  Email Address
                </label>
                <div className="relative" style={{ position: "relative" }}>
                  {/* Glow on focus */}
                  <AnimatePresence>
                    {focusedField === "email" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 rounded-xl pointer-events-none"
                        style={{
                          boxShadow: "0 0 0 3px rgba(168,85,247,0.25), 0 0 20px rgba(168,85,247,0.1)",
                          borderRadius: "0.75rem"
                        }}
                      />
                    )}
                  </AnimatePresence>
                  <FiMail
                    className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 pointer-events-none"
                    size={16}
                    style={{ color: focusedField === "email" ? "#a855f7" : "rgba(255,255,255,0.2)" }}
                  />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    style={{
                      width: "100%",
                      paddingLeft: "2.75rem",
                      paddingRight: "1rem",
                      paddingTop: "0.875rem",
                      paddingBottom: "0.875rem",
                      background: focusedField === "email" ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${focusedField === "email" ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: "0.75rem",
                      outline: "none",
                      transition: "all 0.2s ease",
                      fontSize: "0.875rem",
                      color: "white",
                      fontWeight: "500",
                    }}
                    className="placeholder:text-white/20"
                  />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">
                    Password
                  </label>
                  <button type="button" className="text-[11px] font-semibold transition-colors"
                    style={{ color: "rgba(168,85,247,0.7)" }}
                    onMouseEnter={e => e.target.style.color = "#a855f7"}
                    onMouseLeave={e => e.target.style.color = "rgba(168,85,247,0.7)"}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <AnimatePresence>
                    {focusedField === "password" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          boxShadow: "0 0 0 3px rgba(168,85,247,0.25), 0 0 20px rgba(168,85,247,0.1)",
                          borderRadius: "0.75rem"
                        }}
                      />
                    )}
                  </AnimatePresence>
                  <FiLock
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200"
                    size={16}
                    style={{ color: focusedField === "password" ? "#a855f7" : "rgba(255,255,255,0.2)" }}
                  />
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    required
                    style={{
                      width: "100%",
                      paddingLeft: "2.75rem",
                      paddingRight: "3rem",
                      paddingTop: "0.875rem",
                      paddingBottom: "0.875rem",
                      background: focusedField === "password" ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${focusedField === "password" ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.08)"}`,
                      borderRadius: "0.75rem",
                      outline: "none",
                      transition: "all 0.2s ease",
                      fontSize: "0.875rem",
                      color: "white",
                      fontWeight: "500",
                    }}
                    className="placeholder:text-white/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}
                  >
                    {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-1"
              >
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  className="w-full relative overflow-hidden group"
                  style={{
                    padding: "0.9rem",
                    borderRadius: "0.875rem",
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    color: "white",
                    background: loading
                      ? "rgba(168,85,247,0.5)"
                      : "linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #4f46e5 100%)",
                    boxShadow: loading ? "none" : "0 8px 32px rgba(147,51,234,0.4), 0 2px 8px rgba(0,0,0,0.3)",
                    border: "1px solid rgba(168,85,247,0.3)",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {/* Shimmer layer */}
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)",
                      backgroundSize: "200% auto",
                      animation: "shimmer 2s linear infinite"
                    }} />
                  {loading ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <>
                      Sign In
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" size={16} />
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex items-center gap-3"
              >
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.18)" }}>or</span>
                <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.07)" }} />
              </motion.div>

              {/* Google */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {googleError ? (
                  <div className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-3"
                    style={{ border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)", color: "rgba(239,68,68,0.5)" }}>
                    <FcGoogle size={20} /> {googleError}
                  </div>
                ) : (
                  <motion.button
                    type="button"
                    onClick={() => signInWithGoogle(handleGoogleSuccess, () => toast.error("Google login failed"))}
                    disabled={!isInitialized || googleLoading}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full text-sm font-semibold flex items-center justify-center gap-3 group transition-all"
                    style={{
                      padding: "0.875rem",
                      borderRadius: "0.875rem",
                      border: "1px solid rgba(255,255,255,0.09)",
                      background: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.8)",
                      cursor: (!isInitialized || googleLoading) ? "not-allowed" : "pointer",
                      opacity: (!isInitialized || googleLoading) ? 0.5 : 1,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                  >
                    {googleLoading ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <><FcGoogle size={20} /> {isInitialized ? "Continue with Google" : "Initializing..."}</>
                    )}
                  </motion.button>
                )}
              </motion.div>

              {/* Footer link */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-center text-sm"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Don't have an account?{" "}
                <Link to="/signup"
                  className="font-bold transition-colors"
                  style={{ color: "#a855f7" }}
                  onMouseEnter={e => e.target.style.color = "#c084fc"}
                  onMouseLeave={e => e.target.style.color = "#a855f7"}>
                  Create one →
                </Link>
              </motion.p>
            </form>
          </motion.div>

          {/* Bottom security note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-xs mt-5"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            🔒 256-bit encrypted · GDPR compliant · Zero logs
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Login;