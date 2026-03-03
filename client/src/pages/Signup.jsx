import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiLock, FiArrowRight, FiEye, FiEyeOff, FiMessageSquare, FiCheck } from "react-icons/fi";

const containerAnim = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } }
};

const itemAnim = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 140, damping: 20 } }
};

/* ===== PASSWORD STRENGTH ===== */
const getStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 1) return { score, label: "Weak", color: "#ef4444" };
  if (score <= 3) return { score, label: "Fair", color: "#f59e0b" };
  if (score <= 4) return { score, label: "Strong", color: "#10b981" };
  return { score, label: "Very Strong", color: "#6366f1" };
};

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

  const strength = getStrength(password);

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

  const fields = [
    { icon: FiUser, label: "Full Name", type: "text", placeholder: "John Doe", value: name, onChange: (e) => setName(e.target.value) },
    { icon: FiMail, label: "Email Address", type: "email", placeholder: "name@example.com", value: email, onChange: (e) => setEmail(e.target.value) },
    { icon: FiPhone, label: "Phone Number", type: "text", placeholder: "+1 (555) 000-0000", value: phone, onChange: (e) => setPhone(e.target.value) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden"
      style={{ background: "#050811" }}>

      {/* Ambient orbs */}
      <div className="orb w-[500px] h-[500px] top-[-150px] right-[-150px] opacity-25"
        style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }} />
      <div className="orb w-[450px] h-[450px] bottom-[-100px] left-[-100px] opacity-15"
        style={{ background: "radial-gradient(circle, var(--color-secondary), transparent 70%)" }} />

      {/* HUD grid */}
      <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />

      {/* Decorative floating circles */}
      {[
        { size: "w-40 h-40", top: "8%", left: "5%", delay: 0 },
        { size: "w-24 h-24", bottom: "12%", right: "8%", delay: 2 },
        { size: "w-16 h-16", top: "50%", left: "2%", delay: 1 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className={`absolute ${s.size} rounded-full border border-white/5 pointer-events-none`}
          style={{ top: s.top, bottom: s.bottom, left: s.left, right: s.right }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear", delay: s.delay }}
        />
      ))}

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
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/40 mx-auto mb-5"
            >
              <FiMessageSquare className="text-white text-2xl" />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-2">Join ChatVerse</h1>
            <p className="text-white/40 text-sm">Create your free account and start chatting</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Standard fields */}
            {fields.map(({ icon: Icon, label, type, placeholder, value, onChange }, i) => (
              <motion.div key={i} variants={itemAnim} className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/30">{label}</label>
                <div className="relative group">
                  <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors duration-200" size={17} />
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required
                    className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/10 focus:border-primary rounded-xl outline-none transition-all duration-200 text-sm text-white placeholder-white/20 font-medium focus:shadow-[0_0_0_4px_rgba(var(--color-primary),0.1)] focus:bg-white/8"
                  />
                </div>
              </motion.div>
            ))}

            {/* Password with strength meter */}
            <motion.div variants={itemAnim} className="flex flex-col gap-2">
              <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/30">Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors duration-200" size={17} />
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3.5 bg-white/5 border border-white/10 focus:border-primary rounded-xl outline-none transition-all duration-200 text-sm text-white placeholder-white/20 font-medium focus:shadow-[0_0_0_4px_rgba(var(--color-primary),0.1)] focus:bg-white/8"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50 transition-colors">
                  {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>

              {/* Strength bar */}
              {password && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="overflow-hidden">
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <motion.div
                        key={n}
                        className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: n <= strength.score ? strength.color : "rgba(255,255,255,0.08)" }}
                        animate={{ scaleX: n <= strength.score ? 1 : 0.6 }}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] mt-1 font-semibold" style={{ color: strength.color }}>{strength.label}</p>
                </motion.div>
              )}
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemAnim} className="mt-3">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, boxShadow: "0 0 30px rgba(var(--color-primary), 0.5)" } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full py-3.5 rounded-xl font-bold text-white bg-primary flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <span className="absolute inset-0 animate-shimmer pointer-events-none opacity-0 group-hover:opacity-100" />
                {loading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <>
                    Create Account
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Perks */}
            <motion.div variants={itemAnim} className="grid grid-cols-2 gap-2 pt-2">
              {["Free forever", "No credit card", "Instant setup", "Fully secure"].map((perk, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-white/30">
                  <FiCheck size={11} className="text-green-400 shrink-0" /> {perk}
                </div>
              ))}
            </motion.div>

            {/* Footer */}
            <motion.p variants={itemAnim} className="text-center text-sm text-white/30 mt-1">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary/80 font-bold transition-colors">
                Sign in →
              </Link>
            </motion.p>
          </form>
        </motion.div>

        {/* Security note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center mt-6 flex items-center justify-center gap-2 text-white/20 text-xs"
        >
          🔒 Your data is private and encrypted
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;