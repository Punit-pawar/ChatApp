import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiLock, FiMessageSquare, FiArrowRight } from "react-icons/fi"; // 👈 Added premium icons

/* ================= PREMIUM ANIMATIONS ================= */
const containerAnim = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20, staggerChildren: 0.08 }
  }
};

const itemAnim = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } }
};

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Creating account...", { style: { borderRadius: '12px' } });

    try {
      const res = await axios.post(
        "http://localhost:4500/api/user/signup",
        {
          name,
          email,
          phone,
          password,
        }
      );

      toast.success(res.data.message || "Account created 🎉", {
        id: toastId,
      });

      // auto redirect to login
      navigate("/login");

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");

    } catch (error) {
      console.error("SIGNUP ERROR 👉", error);

      toast.error(
        error?.response?.data?.message || "Signup failed",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] px-4 relative overflow-hidden font-sans selection:bg-primary/30 selection:text-primary py-10"
      style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* High-End Ambient Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary/10 blur-[120px] pointer-events-none animate-pulse delay-1000"></div>

      <div className="w-full max-w-md relative z-10">
        <motion.form
          variants={containerAnim}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit}
          className="bg-base-100/70 dark:bg-base-100/40 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/60 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10"
        >
          <div className="flex flex-col gap-5">

            {/* Header Area */}
            <motion.div variants={itemAnim} className="text-center mb-2">
              <div className="mx-auto w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-6">
                <FiMessageSquare className="text-white text-2xl" />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-base-content">
                Create Account
              </h2>
              <p className="text-base-content/60 font-medium mt-2 text-sm">
                Join ChatVerse and start connecting.
              </p>
            </motion.div>

            {/* Name Input */}
            <motion.div variants={itemAnim} className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-base-content/50 uppercase tracking-widest pl-1">
                Full Name
              </label>
              <div className="relative flex items-center group">
                <FiUser className="absolute left-4 text-base-content/40 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Lucky pawar"
                  className="w-full pl-11 pr-4 py-3.5 bg-base-100/50 border border-base-content/10 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all font-medium text-sm text-base-content"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
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

            {/* Phone Input */}
            <motion.div variants={itemAnim} className="flex flex-col gap-1.5">
              <label className="text-[11px] font-bold text-base-content/50 uppercase tracking-widest pl-1">
                Phone Number
              </label>
              <div className="relative flex items-center group">
                <FiPhone className="absolute left-4 text-base-content/40 group-focus-within:text-primary transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-11 pr-4 py-3.5 bg-base-100/50 border border-base-content/10 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-xl outline-none transition-all font-medium text-sm text-base-content"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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

            {/* Submit Button */}
            <motion.div variants={itemAnim} className="mt-4">
              <button
                type="submit"
                className="group w-full bg-primary hover:bg-primary-focus text-white py-3.5 rounded-xl font-bold tracking-wide shadow-lg shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <>
                    Sign Up
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>

            {/* Footer Link */}
            <motion.p variants={itemAnim} className="text-center text-sm font-medium text-base-content/60 mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-primary-focus hover:underline font-bold transition-colors">
                Sign in here
              </Link>
            </motion.p>

          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Signup;