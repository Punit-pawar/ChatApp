import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiMenu, FiUser, FiMessageSquare, FiLogOut, FiCamera,
  FiChevronLeft, FiEdit2, FiCheck, FiX, FiTrash2,
  FiSend, FiZap, FiActivity, FiSettings, FiChevronDown,
  FiCopy, FiRefreshCw, FiMaximize2, FiMinimize2
} from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

/* ===== CLOUDINARY ===== */
const CLOUD_NAME = "YOUR_CLOUD_NAME";
const UPLOAD_PRESET = "chatverse_profile";

/* ===== ANIMATIONS ===== */
const pageAnim = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 90, damping: 20, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -20, filter: "blur(8px)", transition: { duration: 0.25 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 18 } },
};

const sidebarTextAnim = {
  hidden: { opacity: 0, width: 0 },
  visible: { opacity: 1, width: "auto", transition: { duration: 0.25 } },
};

const messageAnim = {
  hidden: { opacity: 0, y: 24, scale: 0.88 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 350, damping: 22 } },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.18 } },
};

/* ===== AI API CALL ===== */
const getBotResponse = async (msg) => {
  try {
    const res = await fetch("http://localhost:4500/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });
    const data = await res.json();
    return data.reply || data.error || "No response from server.";
  } catch {
    return "⚠️ Cannot reach AI server. Make sure the backend is running.";
  }
};

/* ===== TYPING DOTS ===== */
const TypingDots = () => (
  <div className="flex gap-1.5 items-center px-4 py-3">
    {[0, 0.18, 0.36].map((d, i) => (
      <motion.span
        key={i}
        className="w-2.5 h-2.5 rounded-full bg-primary"
        animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 0.8, repeat: Infinity, delay: d, ease: "easeInOut" }}
        style={{ boxShadow: "0 0 8px var(--color-primary)" }}
      />
    ))}
  </div>
);

/* ===== SIDEBAR ITEM ===== */
const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed, badge }) => (
  <motion.li whileHover={{ x: collapsed ? 0 : 4 }} whileTap={{ scale: 0.96 }}>
    <button onClick={onClick}
      className={`relative flex items-center gap-3.5 w-full px-3 py-3 rounded-2xl transition-all duration-200 group overflow-hidden ${active ? "text-white" : "text-white/40 hover:text-white/80"
        }`}
    >
      {active && (
        <motion.div
          layoutId="sidebar-active"
          className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/60 rounded-2xl"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute inset-0 animate-shimmer rounded-2xl" />
        </motion.div>
      )}
      {!active && (
        <span className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-2xl transition-colors" />
      )}
      <Icon size={20} className={`shrink-0 relative z-10 transition-all ${active ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "group-hover:scale-110"}`} />
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            variants={sidebarTextAnim} initial="hidden" animate="visible" exit="hidden"
            className="text-[13px] font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden relative z-10"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
      {badge && !collapsed && (
        <span className="ml-auto relative z-10 bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  </motion.li>
);

/* ===== STAT CARD ===== */
const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div variants={itemAnim} whileHover={{ y: -4, scale: 1.02 }}
    className="glass-card rounded-2xl p-5 flex items-center gap-4 border border-white/10">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: `${color}22`, border: `1px solid ${color}33` }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <p className="text-2xl font-black text-white">{value}</p>
      <p className="text-white/40 text-xs font-medium">{label}</p>
    </div>
  </motion.div>
);

/* ===== MAIN COMPONENT ===== */
const UserDashboard = () => {
  const navigate = useNavigate();

  // State
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("profile");
  const [collapsed, setCollapsed] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [charLimit] = useState(500);
  const [fullscreen, setFullscreen] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Welcome to **ChatVerse AI**! I'm your intelligent assistant. Ask me anything — I'm here to help.",
      sender: "system",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  // Auth guard
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) navigate("/login");
    else setUser(JSON.parse(stored));
  }, [navigate]);

  // Auto scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  // Focus input on chat tab
  useEffect(() => {
    if (active === "chat") setTimeout(() => inputRef.current?.focus(), 400);
  }, [active]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast("See you soon! 👋", { icon: "🚪" });
    navigate("/login");
  };

  /* ===== PROFILE EDIT ===== */
  const handleSave = async () => {
    const id = toast.loading("Saving changes...");
    await new Promise((r) => setTimeout(r, 900));
    const updated = { ...user, ...formData };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    setIsEditing(false);
    toast.success("Profile updated! 🚀", { id });
  };

  /* ===== SEND MESSAGE ===== */
  const handleSend = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isTyping) return;

    const userMsg = {
      id: Date.now(),
      text,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((p) => [...p, userMsg]);
    setInputValue("");
    setIsTyping(true);

    const reply = await getBotResponse(text);
    const botMsg = {
      id: Date.now() + 1,
      text: reply,
      sender: "system",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setIsTyping(false);
    setMessages((p) => [...p, botMsg]);
  }, [inputValue, isTyping]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleDelete = (id) => {
    setMessages((p) => p.filter((m) => m.id !== id));
    toast("Message deleted", { icon: "🗑️", duration: 1500 });
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!", { duration: 1200 });
  };

  const handleClearChat = () => {
    setMessages([{
      id: Date.now(),
      text: "Chat cleared. Fresh start! How can I help you? ✨",
      sender: "system",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    toast("Chat cleared", { icon: "✨", duration: 1500 });
  };

  /* ===== AVATAR UPLOAD ===== */
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const id = toast.loading("Uploading photo...");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", UPLOAD_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (!data.secure_url) throw new Error();
      const updated = { ...user, avatar: data.secure_url };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      toast.success("Photo updated! 📸", { id });
    } catch {
      toast.error("Upload failed", { id });
    }
  };

  if (!user) return (
    <div className="h-screen flex items-center justify-center" style={{ background: "#050811" }}>
      <span className="loading loading-spinner loading-lg text-primary" />
    </div>
  );

  const msgCount = messages.filter((m) => m.sender === "user").length;

  return (
    <div
      className="h-screen w-full flex overflow-hidden text-white relative"
      style={{ background: "#050811", fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui" }}
    >
      {/* Ambient BG */}
      <div className="absolute inset-0 hud-grid opacity-20 pointer-events-none" />
      <motion.div animate={{ x: [0, 40, 0], y: [0, 25, 0] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="orb w-[50vw] h-[50vw] top-[-20%] left-[-15%] opacity-10"
        style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }} />
      <motion.div animate={{ x: [0, -40, 0], y: [0, -25, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="orb w-[45vw] h-[45vw] bottom-[-20%] right-[-10%] opacity-8"
        style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }} />

      <div className={`flex w-full h-full z-10 relative ${fullscreen && active === "chat" ? "p-0" : "p-3 md:p-4 gap-4"}`}>

        {/* ========== SIDEBAR ========== */}
        {(!fullscreen || active !== "chat") && (
          <motion.aside
            initial={false}
            animate={{ width: collapsed ? "76px" : "250px" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full shrink-0 flex flex-col rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.4)]"
            style={{ background: "rgba(12,18,34,0.85)", backdropFilter: "blur(20px)" }}
          >
            {/* Logo */}
            <div className="p-5 flex items-center justify-between border-b border-white/5 min-h-[72px]">
              <AnimatePresence>
                {!collapsed && (
                  <motion.div key="logo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                      <FiMessageSquare size={16} className="text-white" />
                    </div>
                    <span className="text-base font-black tracking-tight bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
                      ChatVerse
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => setCollapsed(!collapsed)}
                className={`w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all ${collapsed ? "mx-auto" : ""}`}
              >
                <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <FiChevronLeft size={16} />
                </motion.div>
              </motion.button>
            </div>

            {/* User pill */}
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-4 mt-4 p-3 rounded-2xl bg-white/5 border border-white/8 flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                    alt="avatar"
                    className="w-10 h-10 rounded-xl object-cover border-2 border-white/10"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0c1222]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-white/30 truncate">{user.email}</p>
                </div>
              </motion.div>
            )}

            {/* Nav */}
            <ul className="flex flex-col gap-1.5 p-3 flex-1 mt-3 overflow-hidden">
              <SidebarItem icon={FiUser} label="Profile" active={active === "profile"} onClick={() => setActive("profile")} collapsed={collapsed} />
              <SidebarItem icon={FiMessageSquare} label="AI Chat" active={active === "chat"} onClick={() => setActive("chat")} collapsed={collapsed} badge={msgCount > 0 ? msgCount : null} />
              <SidebarItem icon={FiActivity} label="Stats" active={active === "stats"} onClick={() => setActive("stats")} collapsed={collapsed} />
            </ul>

            {/* Logout */}
            <div className="p-3 border-t border-white/5">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "rgba(239,68,68,0.12)" }}
                whileTap={{ scale: 0.96 }}
                onClick={handleLogout}
                className={`flex items-center gap-3 w-full px-3 py-3 rounded-2xl text-white/30 hover:text-red-400 transition-all duration-200 ${collapsed ? "justify-center" : ""}`}
              >
                <FiLogOut size={20} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span variants={sidebarTextAnim} initial="hidden" animate="visible" exit="hidden"
                      className="text-[13px] font-bold uppercase tracking-wider">
                      Logout
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.aside>
        )}

        {/* ========== MAIN AREA ========== */}
        <main className="flex-1 min-w-0 h-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.4)] flex flex-col"
          style={{ background: "rgba(12,18,34,0.7)", backdropFilter: "blur(24px)" }}>

          <AnimatePresence mode="wait">

            {/* ======== PROFILE TAB ======== */}
            {active === "profile" && (
              <motion.div key="profile" variants={pageAnim} initial="hidden" animate="visible" exit="exit"
                className="h-full flex flex-col w-full overflow-y-auto custom-scrollbar p-6 md:p-8 gap-6">

                {/* Header */}
                <motion.div variants={itemAnim} className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">My Profile</h2>
                    <p className="text-white/30 text-sm mt-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online now
                    </p>
                  </div>
                  {!isEditing && (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => { setFormData({ name: user.name, phone: user.phone || "" }); setIsEditing(true); }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm font-semibold"
                    >
                      <FiEdit2 size={14} /> Edit Profile
                    </motion.button>
                  )}
                </motion.div>

                {/* Avatar + info row */}
                <div className="grid lg:grid-cols-3 gap-5">

                  {/* Avatar card */}
                  <motion.div variants={itemAnim}
                    className="glass-card rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden border border-white/10 group hover:border-primary/30 transition-all">
                    {/* Corner accents */}
                    {[["top-3 left-3", "border-t border-l"], ["top-3 right-3", "border-t border-r"], ["bottom-3 left-3", "border-b border-l"], ["bottom-3 right-3", "border-b border-r"]].map(([pos, b], i) => (
                      <div key={i} className={`absolute ${pos} w-4 h-4 ${b} border-white/15 group-hover:border-primary/40 transition-colors`} />
                    ))}

                    {/* Avatar */}
                    <div className="relative w-36 h-36 mb-5">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent shadow-[0_0_20px_rgba(var(--color-primary),0.4)]" />
                      <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-10px] rounded-full border border-dashed border-accent/30" />
                      <div className="absolute inset-2 rounded-full overflow-hidden border-4 border-[#0a0f1c]">
                        <img
                          src={user.avatar
                            ? `${user.avatar}?t=${Date.now()}`
                            : `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                          alt="avatar"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <motion.label
                        whileHover={{ scale: 1.15, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-xl shadow-[0_0_15px_rgba(var(--color-primary),0.6)] cursor-pointer border border-white/10"
                      >
                        <FiCamera size={16} />
                        <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
                      </motion.label>
                    </div>

                    <h3 className="text-2xl font-black text-white">{user.name}</h3>
                    <p className="text-white/30 text-sm mt-1 font-mono">{user.email}</p>

                    <div className="flex items-center gap-2 mt-5 px-5 py-2 rounded-xl bg-green-400/10 border border-green-400/20 text-green-400 text-xs font-bold">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute rounded-full h-full w-full bg-green-400 opacity-60" />
                        <span className="relative rounded-full h-2 w-2 bg-green-400" />
                      </span>
                      Active Now
                    </div>
                  </motion.div>

                  {/* Data card */}
                  <motion.div variants={itemAnim}
                    className="lg:col-span-2 glass-card rounded-3xl p-7 border border-white/10 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2.5">
                        <span className="text-primary"><FiUser /></span> Account Details
                      </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      {[
                        { label: "Full Name", name: "name", value: isEditing ? formData.name : user.name },
                        { label: "Phone", name: "phone", value: isEditing ? formData.phone : (user.phone || "Not set") },
                      ].map(({ label, name, value }) => (
                        <div key={name} className="flex flex-col gap-2">
                          <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary/60">{label}</label>
                          {isEditing ? (
                            <input
                              name={name}
                              value={value}
                              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
                              className="w-full px-4 py-3.5 rounded-xl bg-black/40 border border-primary/40 text-white text-sm font-medium outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(var(--color-primary),0.1)] transition-all"
                            />
                          ) : (
                            <p className="px-4 py-3.5 rounded-xl bg-white/5 border border-white/5 text-white/70 text-sm font-medium">{value}</p>
                          )}
                        </div>
                      ))}

                      <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary/60">Email Address</label>
                        <div className="relative">
                          <input value={user.email} disabled className="w-full px-4 pr-28 py-3.5 rounded-xl bg-white/3 border border-white/5 text-white/40 text-sm font-mono cursor-not-allowed" />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-green-400 flex items-center gap-1">
                            <FiCheck size={11} /> Verified
                          </span>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {isEditing && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                          className="flex gap-3 justify-end pt-2 border-t border-white/5 overflow-hidden">
                          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white/40 hover:text-white border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2">
                            <FiX size={14} /> Cancel
                          </motion.button>
                          <motion.button whileHover={{ scale: 1.04, boxShadow: "0 0 25px rgba(var(--color-primary),0.5)" }} whileTap={{ scale: 0.96 }}
                            onClick={handleSave}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/30 flex items-center gap-2">
                            <FiCheck size={14} /> Save Changes
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Quick actions */}
                <motion.div variants={itemAnim} className="glass-card rounded-3xl p-6 border border-white/10">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-4">Quick Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { label: "Go to Chat", icon: FiMessageSquare, onClick: () => setActive("chat"), color: "primary" },
                      { label: "View Stats", icon: FiActivity, onClick: () => setActive("stats"), color: "accent" },
                      { label: "Logout", icon: FiLogOut, onClick: handleLogout, color: "error" },
                    ].map(({ label, icon: Icon, onClick, color }, i) => (
                      <motion.button key={i} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
                        onClick={onClick}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${color === "error"
                            ? "border-red-500/20 text-red-400/60 hover:bg-red-500/10 hover:text-red-400"
                            : "border-white/10 text-white/50 hover:bg-white/8 hover:text-white"
                          }`}>
                        <Icon size={15} /> {label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* ======== CHAT TAB ======== */}
            {active === "chat" && (
              <motion.div key="chat" variants={pageAnim} initial="hidden" animate="visible" exit="exit"
                className="h-full flex flex-col w-full">

                {/* Chat header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12">
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-full border border-primary/40 border-t-primary" />
                      <div className="absolute inset-1.5 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <RiRobot2Line size={18} className="text-primary" />
                      </div>
                    </div>
                    <div>
                      <h2 className="text-base font-black text-white tracking-tight">ChatVerse AI</h2>
                      <div className="flex items-center gap-1.5 text-[11px] text-green-400 font-semibold mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        {isTyping ? "Thinking..." : "Online · Ready"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={handleClearChat}
                      className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"
                      title="Clear chat">
                      <FiRefreshCw size={15} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => setFullscreen(!fullscreen)}
                      className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:bg-white/10 transition-all"
                      title="Toggle fullscreen">
                      {fullscreen ? <FiMinimize2 size={15} /> : <FiMaximize2 size={15} />}
                    </motion.button>
                  </div>
                </div>

                {/* Messages */}
                <div ref={chatContainerRef} className="flex-1 min-h-0 overflow-y-auto custom-scrollbar p-5 md:p-7 space-y-5">
                  <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        layout
                        variants={messageAnim}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className={`flex flex-col gap-1.5 max-w-[80%] ${msg.sender === "user" ? "items-end self-end ml-auto" : "items-start"}`}
                      >
                        {/* Sender label */}
                        <span className={`text-[10px] font-bold uppercase tracking-widest text-white/20 ${msg.sender === "user" ? "mr-1" : "ml-1"}`}>
                          {msg.sender === "user" ? user.name?.split(" ")[0] : "ChatVerse AI"} · {msg.time}
                        </span>

                        <div className={`flex items-end gap-2 group ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                          {/* Avatar dot */}
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mb-1 ${msg.sender === "user"
                              ? "bg-gradient-to-br from-primary to-accent"
                              : "bg-white/10 border border-white/10"
                            }`}>
                            {msg.sender === "user"
                              ? <span className="text-[9px] font-black text-white">{user.name?.[0]}</span>
                              : <RiRobot2Line size={12} className="text-primary" />
                            }
                          </div>

                          {/* Bubble */}
                          <div className={`relative px-5 py-3.5 rounded-2xl text-sm leading-relaxed font-medium max-w-xl ${msg.sender === "user"
                              ? "bg-gradient-to-br from-primary to-accent/90 text-white rounded-tr-none shadow-[0_4px_20px_rgba(var(--color-primary),0.3)] border border-white/15"
                              : "bg-white/6 backdrop-blur-sm text-white/85 rounded-tl-none border border-white/10"
                            }`}>
                            <span className="absolute inset-0 rounded-inherit overflow-hidden pointer-events-none">
                              <span className="block w-full h-full animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                            </span>
                            {msg.text}
                          </div>

                          {/* Actions */}
                          <div className={`flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 ${msg.sender === "user" ? "order-first" : ""}`}>
                            <motion.button whileHover={{ scale: 1.2 }} onClick={() => handleCopy(msg.text)}
                              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/30 hover:text-white transition-all">
                              <FiCopy size={12} />
                            </motion.button>
                            {msg.sender === "user" && (
                              <motion.button whileHover={{ scale: 1.2 }} onClick={() => handleDelete(msg.id)}
                                className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400/50 hover:text-red-400 transition-all">
                                <FiTrash2 size={12} />
                              </motion.button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 16, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col gap-1.5 max-w-[80%] items-start"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 ml-1">ChatVerse AI · Thinking</span>
                        <div className="flex items-end gap-2">
                          <div className="w-6 h-6 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mb-1">
                            <RiRobot2Line size={12} className="text-primary" />
                          </div>
                          <div className="bg-white/6 border border-white/10 rounded-2xl rounded-tl-none">
                            <TypingDots />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/5 shrink-0">
                  <div className={`flex items-end gap-3 relative rounded-2xl border transition-all duration-200 ${inputValue ? "border-primary/50 bg-black/40 shadow-[0_0_0_4px_rgba(var(--color-primary),0.08)]" : "border-white/10 bg-white/4"
                    }`}>
                    <div className="flex items-center pl-4 pb-3 pt-3.5 shrink-0 self-end">
                      <FiZap size={17} className={`transition-colors ${inputValue ? "text-primary" : "text-white/20"}`} />
                    </div>

                    <textarea
                      ref={inputRef}
                      rows={1}
                      value={inputValue}
                      onChange={(e) => {
                        setInputValue(e.target.value.slice(0, charLimit));
                        e.target.style.height = "auto";
                        e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px";
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything..."
                      className="flex-1 bg-transparent py-3.5 text-sm text-white placeholder-white/20 outline-none resize-none font-medium leading-relaxed"
                      style={{ maxHeight: "140px" }}
                    />

                    <div className="flex items-center gap-2 pr-3 pb-3 pt-3 self-end shrink-0">
                      {inputValue && (
                        <span className={`text-[10px] font-mono ${inputValue.length > charLimit * 0.85 ? "text-orange-400" : "text-white/20"}`}>
                          {inputValue.length}/{charLimit}
                        </span>
                      )}
                      <motion.button
                        whileHover={inputValue.trim() && !isTyping ? { scale: 1.1, boxShadow: "0 0 20px rgba(var(--color-primary),0.6)" } : {}}
                        whileTap={inputValue.trim() && !isTyping ? { scale: 0.9 } : {}}
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isTyping}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${inputValue.trim() && !isTyping
                            ? "bg-primary text-white shadow-lg shadow-primary/40"
                            : "bg-white/5 text-white/20 cursor-not-allowed"
                          }`}
                      >
                        <FiSend size={15} />
                      </motion.button>
                    </div>
                  </div>
                  <p className="text-center text-[11px] text-white/15 mt-2">
                    Press <kbd className="font-mono bg-white/5 rounded px-1">Enter ↵</kbd> to send · <kbd className="font-mono bg-white/5 rounded px-1">Shift+Enter</kbd> for new line
                  </p>
                </div>
              </motion.div>
            )}

            {/* ======== STATS TAB ======== */}
            {active === "stats" && (
              <motion.div key="stats" variants={pageAnim} initial="hidden" animate="visible" exit="exit"
                className="h-full flex flex-col w-full overflow-y-auto custom-scrollbar p-6 md:p-8 gap-6">

                <motion.div variants={itemAnim} className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Activity Stats</h2>
                    <p className="text-white/30 text-sm mt-1">Your ChatVerse usage overview</p>
                  </div>
                </motion.div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={FiMessageSquare} label="Messages Sent" value={msgCount} color="var(--color-primary)" />
                  <StatCard icon={FiZap} label="AI Responses" value={messages.filter(m => m.sender === "system").length - 1} color="var(--color-accent)" />
                  <StatCard icon={FiActivity} label="Session Length" value="Active" color="#10b981" />
                  <StatCard icon={FiUser} label="Member Since" value="2025" color="#f59e0b" />
                </div>

                {/* Chat preview */}
                <motion.div variants={itemAnim} className="glass-card rounded-3xl p-6 border border-white/10">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-4">Recent Messages</h3>
                  {messages.filter(m => m.sender === "user").length === 0 ? (
                    <div className="text-center py-12 text-white/20">
                      <FiMessageSquare size={32} className="mx-auto mb-3 opacity-50" />
                      <p className="text-sm">No messages yet. Start chatting!</p>
                      <motion.button whileHover={{ scale: 1.05 }} onClick={() => setActive("chat")}
                        className="mt-4 px-5 py-2.5 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm font-bold hover:bg-primary/20 transition-all">
                        Open Chat
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                      {messages.filter(m => m.sender === "user").map((m, i) => (
                        <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="flex items-start gap-3 p-3 rounded-xl bg-white/4 border border-white/5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] font-black text-white">{user.name?.[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm text-white/70 leading-relaxed">{m.text}</p>
                            <p className="text-[10px] text-white/20 mt-1">{m.time}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Profile summary */}
                <motion.div variants={itemAnim} className="glass-card rounded-3xl p-6 border border-white/10">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/30 mb-4">Account Summary</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { label: "Name", value: user.name },
                      { label: "Email", value: user.email },
                      { label: "Phone", value: user.phone || "Not set" },
                      { label: "Status", value: "✅ Active" },
                    ].map(({ label, value }, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/4 border border-white/5">
                        <span className="text-xs text-white/30 font-bold uppercase tracking-wider w-14 shrink-0">{label}</span>
                        <span className="text-sm text-white/70 font-medium truncate">{value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;