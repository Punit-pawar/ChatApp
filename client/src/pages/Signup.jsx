import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser, FiMail, FiPhone, FiLock, FiArrowRight,
  FiEye, FiEyeOff, FiMessageSquare, FiCheck,
  FiZap, FiShield, FiGlobe
} from "react-icons/fi";

/* ============================================================
   PASSWORD STRENGTH
   ============================================================ */
const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score, label: "Weak", color: "#ef4444", bg: "rgba(239,68,68,0.1)" };
  if (score <= 3) return { score, label: "Fair", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" };
  if (score <= 4) return { score, label: "Strong", color: "#10b981", bg: "rgba(16,185,129,0.1)" };
  return { score, label: "Very Strong", color: "#a855f7", bg: "rgba(168,85,247,0.1)" };
};

/* ============================================================
   STEP INDICATOR
   ============================================================ */
const steps = ["Account", "Security", "Done"];

/* ============================================================
   FLOATING PARTICLE LAYER
   ============================================================ */
const ParticleLayer = () => {
  const particles = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    duration: 10 + Math.random() * 10,
    delay: Math.random() * 10,
    color: i % 3 === 0 ? "#a855f7" : i % 3 === 1 ? "#3b82f6" : "#06b6d4",
    opacity: 0.1 + Math.random() * 0.35,
  }));

  return (
    <>
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, background: p.color, opacity: p.opacity }}
          animate={{ y: [0, -35, 0], opacity: [p.opacity, p.opacity * 2, p.opacity] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
};

/* ============================================================
   LEFT PANEL STATS
   ============================================================ */
const stats = [
  { value: "120K+", label: "Active users", icon: FiZap, color: "#a855f7" },
  { value: "99.9%", label: "Uptime", icon: FiShield, color: "#3b82f6" },
  { value: "50+", label: "Countries", icon: FiGlobe, color: "#06b6d4" },
];

/* ============================================================
   PERKS LIST
   ============================================================ */
const perks = ["Free forever", "No credit card", "Instant setup", "Fully secure"];

/* ============================================================
   SIGNUP COMPONENT
   ============================================================ */
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

  const strength = getStrength(password);

  // Derive step from filled fields
  const currentStep = !name || !email ? 0 : !password ? 1 : 2;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const id = toast.loading("Creating your account...");
    try {
      const res = await axios.post("http://localhost:4500/api/user/signup", { name, email, phone, password });
      toast.success(res.data.message || "Account created! 🎉", { id });
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Signup failed", { id });
    } finally {
      setLoading(false);
    }
  };

  // Helper: get field styles based on focus state
  const getInputStyle = (fieldName) => ({
    width: "100%",
    paddingLeft: "2.85rem",
    paddingRight: "1rem",
    paddingTop: "0.875rem",
    paddingBottom: "0.875rem",
    background: focusedField === fieldName ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.04)",
    border: `1px solid ${focusedField === fieldName ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.08)"}`,
    borderRadius: "0.75rem",
    outline: "none",
    transition: "all 0.2s ease",
    fontSize: "0.875rem",
    color: "white",
    fontWeight: "500",
  });

  const getIconStyle = (fieldName) => ({
    color: focusedField === fieldName ? "#a855f7" : "rgba(255,255,255,0.2)",
    transition: "color 0.2s ease",
  });

  /* ===== FOCUS GLOW ===== */
  const FocusGlow = ({ field }) =>
    focusedField === field ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: "0 0 0 3px rgba(168,85,247,0.22), 0 0 20px rgba(168,85,247,0.08)",
          borderRadius: "0.75rem",
        }}
      />
    ) : null;

  return (
    <div className="min-h-screen flex overflow-hidden" style={{ background: "#060912" }}>

      {/* ===== LEFT PANEL ===== */}
      <div className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-12 overflow-hidden"
        style={{ background: "linear-gradient(145deg, #0d0b1f 0%, #150b2e 35%, #0c1444 70%, #070d1f 100%)" }}>

        <ParticleLayer />

        {/* Ambient orbs */}
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{ width: 500, height: 500, top: "-15%", right: "-20%", background: "radial-gradient(circle, rgba(168,85,247,0.2), transparent 70%)", filter: "blur(100px)" }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{ width: 400, height: 400, bottom: "-10%", left: "-15%", background: "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)", filter: "blur(90px)" }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "50px 50px"
        }} />

        {/* Edge fade */}
        <div className="absolute right-0 inset-y-0 w-20 pointer-events-none" style={{
          background: "linear-gradient(to right, transparent, #060912)"
        }} />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}>
              <FiMessageSquare className="text-white" size={20} />
            </div>
            <span className="text-white font-black text-xl tracking-tight">ChatVerse</span>
          </div>

          <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
            Start for<br />
            <span style={{
              background: "linear-gradient(135deg, #a855f7, #3b82f6, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundSize: "200% 200%",
              animation: "gradientShift 4s ease infinite"
            }}>
              free today
            </span>
          </h2>
          <p className="text-white/50 text-base leading-relaxed max-w-xs">
            No credit card needed. Join thousands of happy users in under 30 seconds.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 grid grid-cols-3 gap-3"
        >
          {stats.map(({ value, label, icon: Icon, color }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="rounded-2xl p-4 flex flex-col gap-2"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
                <Icon size={14} style={{ color }} />
              </div>
              <div>
                <p className="text-white font-black text-xl leading-none">{value}</p>
                <p className="text-white/40 text-xs mt-0.5">{label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Progress / step visual */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="relative z-10"
        >
          <div className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-4">Sign-up progress</p>
            <div className="flex items-center gap-2">
              {steps.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                      animate={{
                        background: i <= currentStep
                          ? "linear-gradient(135deg, #9333ea, #4f46e5)"
                          : "rgba(255,255,255,0.08)",
                        scale: i === currentStep ? 1.15 : 1,
                      }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    >
                      {i < currentStep ? <FiCheck size={13} /> : i + 1}
                    </motion.div>
                    <span className="text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: i <= currentStep ? "rgba(168,85,247,0.9)" : "rgba(255,255,255,0.25)" }}>
                      {step}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <motion.div
                      animate={{ background: i < currentStep ? "linear-gradient(to right, #9333ea, #4f46e5)" : "rgba(255,255,255,0.07)" }}
                      className="flex-1 h-0.5 rounded-full mb-4"
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <p className="text-white/20 text-xs text-center mt-4">
            🔒 Your data is private and encrypted
          </p>
        </motion.div>
      </div>

      {/* ===== RIGHT PANEL — FORM ===== */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 relative overflow-auto"
        style={{ background: "#060912" }}>

        {/* Mobile background */}
        <div className="absolute inset-0 lg:hidden pointer-events-none overflow-hidden">
          <div className="absolute w-[500px] h-[500px] top-[-200px] right-[-200px] rounded-full blur-[100px]"
            style={{ background: "radial-gradient(circle, rgba(168,85,247,0.18), transparent 70%)" }} />
          <div className="absolute w-[350px] h-[350px] bottom-[-100px] left-[-100px] rounded-full blur-[80px]"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.12), transparent 70%)" }} />
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
              className="mb-7"
            >
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-black text-white tracking-tight">Create account</h1>
                <span className="text-xl">🚀</span>
              </div>
              <p className="text-white/40 text-sm">Join ChatVerse and start connecting today</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              {/* Full Name */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18 }}
                className="flex flex-col gap-1.5"
              >
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">Full Name</label>
                <div className="relative">
                  <AnimatePresence>
                    {focusedField === "name" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                        style={{ boxShadow: "0 0 0 3px rgba(168,85,247,0.22)", borderRadius: "0.75rem" }} />
                    )}
                  </AnimatePresence>
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" size={15} style={getIconStyle("name")} />
                  <input
                    type="text" placeholder="John Doe" value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    required style={getInputStyle("name")}
                    className="placeholder:text-white/20"
                  />
                </div>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22 }}
                className="flex flex-col gap-1.5"
              >
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">Email Address</label>
                <div className="relative">
                  <AnimatePresence>
                    {focusedField === "email" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                        style={{ boxShadow: "0 0 0 3px rgba(168,85,247,0.22)", borderRadius: "0.75rem" }} />
                    )}
                  </AnimatePresence>
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" size={15} style={getIconStyle("email")} />
                  <input
                    type="email" placeholder="name@example.com" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required style={getInputStyle("email")}
                    className="placeholder:text-white/20"
                  />
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.26 }}
                className="flex flex-col gap-1.5"
              >
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">Phone Number</label>
                <div className="relative">
                  <AnimatePresence>
                    {focusedField === "phone" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                        style={{ boxShadow: "0 0 0 3px rgba(168,85,247,0.22)", borderRadius: "0.75rem" }} />
                    )}
                  </AnimatePresence>
                  <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" size={15} style={getIconStyle("phone")} />
                  <input
                    type="text" placeholder="+1 (555) 000-0000" value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                    required style={getInputStyle("phone")}
                    className="placeholder:text-white/20"
                  />
                </div>
              </motion.div>

              {/* Password + Strength */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col gap-1.5"
              >
                <label className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">Password</label>
                <div className="relative">
                  <AnimatePresence>
                    {focusedField === "password" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 pointer-events-none"
                        style={{ boxShadow: "0 0 0 3px rgba(168,85,247,0.22)", borderRadius: "0.75rem" }} />
                    )}
                  </AnimatePresence>
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" size={15} style={getIconStyle("password")} />
                  <input
                    type={showPwd ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    required
                    style={{ ...getInputStyle("password"), paddingRight: "3rem" }}
                    className="placeholder:text-white/20"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                    onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
                    onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.25)"}>
                    {showPwd ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>

                {/* Strength Meter */}
                <AnimatePresence>
                  {password && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <motion.div
                            key={n}
                            className="flex-1 h-1 rounded-full"
                            animate={{
                              background: n <= strength.score ? strength.color : "rgba(255,255,255,0.06)",
                              scaleX: n <= strength.score ? 1 : 0.5,
                            }}
                            transition={{ duration: 0.25 }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-[11px] font-bold" style={{ color: strength.color }}>{strength.label}</p>
                        <p className="text-[11px] text-white/25">{strength.score}/5</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
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
                      Create Account
                      <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-200" size={16} />
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Perks */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-2 gap-y-2 gap-x-3 pt-1"
              >
                {perks.map((perk, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
                      <FiCheck size={9} style={{ color: "#10b981" }} />
                    </div>
                    <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>{perk}</span>
                  </div>
                ))}
              </motion.div>

              {/* Footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="text-center text-sm"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                Already have an account?{" "}
                <Link to="/login"
                  className="font-bold transition-colors"
                  style={{ color: "#a855f7" }}
                  onMouseEnter={e => e.target.style.color = "#c084fc"}
                  onMouseLeave={e => e.target.style.color = "#a855f7"}>
                  Sign in →
                </Link>
              </motion.p>
            </form>
          </motion.div>

          {/* Bottom note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-xs mt-5"
            style={{ color: "rgba(255,255,255,0.18)" }}
          >
            🔒 Your data is private and encrypted
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Signup;