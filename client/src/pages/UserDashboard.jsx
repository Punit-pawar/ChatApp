import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  FiMenu, 
  FiUser, 
  FiMessageSquare, 
  FiLogOut, 
  FiCamera, 
  FiChevronLeft,
  FiEdit2,
  FiCheck,
  FiX,
  FiTrash2,
  FiTerminal
} from "react-icons/fi";

/* ================= CLOUDINARY CONFIG ================= */
const CLOUD_NAME = "YOUR_CLOUD_NAME"; 
const UPLOAD_PRESET = "chatverse_profile"; 

/* ================= FUTURISTIC ANIMATIONS ================= */
const pageAnim = {
  hidden: { opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 20, staggerChildren: 0.12 } 
  },
  exit: { opacity: 0, y: -20, scale: 0.95, filter: "blur(10px)", transition: { duration: 0.3 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 150, damping: 15 } }
};

const textAnim = {
  hidden: { opacity: 0, width: 0, x: -10, transition: { duration: 0.2, ease: "easeInOut" } },
  visible: { opacity: 1, width: "auto", x: 0, transition: { duration: 0.3, ease: "easeOut", delay: 0.05 } }
};

const messageAnim = {
  hidden: { opacity: 0, y: 30, scale: 0.5, rotate: -5, transformOrigin: "bottom left" },
  visible: { opacity: 1, y: 0, scale: 1, rotate: 0, transition: { type: "spring", stiffness: 400, damping: 20 } },
  exit: { opacity: 0, scale: 0.8, y: -10, transition: { duration: 0.2 } } 
};

/* --- SIDEBAR ANIMATIONS --- */
const menuContainerAnim = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const menuItemAnim = {
  hidden: { opacity: 0, x: -30, filter: "blur(5px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 300, damping: 24 } }
};

/* --- PROFILE FORM ANIMATIONS --- */
const formContainerAnim = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 }
  }
};

const formItemAnim = {
  hidden: { opacity: 0, x: 30, filter: "blur(5px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 200, damping: 20 } }
};

const getBotResponse = async (userMessage) => {
  try {
    const response = await fetch("http://localhost:4500/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    if (data.reply) {
      return data.reply;
    }

    if (data.error) {
      return data.error;
    }

    return "Unknown server response.";
  } catch (error) {
    console.error("Frontend Error:", error);
    return "Cannot connect to AI server.";
  }
};


const UserDashboard = () => {
  const navigate = useNavigate();
  
  // Base States
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("profile");
  const [collapsed, setCollapsed] = useState(false);

  // Edit Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });

  /* ================= CHAT STATES ================= */
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false); // NEW UI STATE for futuristic feel
  const chatContainerRef = useRef(null); 
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "System initialized. Secure workspace established. Awaiting your input... ✨",
      sender: "system",
      time: "12:00 PM",
    }
  ]);

  /* ================= AUTO SCROLL CHAT ================= */
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [messages, isTyping, active]);

  /* ================= AUTH ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) navigate("/login");
    else setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* ================= EDIT PROFILE LOGIC ================= */
  const handleEditClick = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveChanges = async () => {
    const toastId = toast.loading("Updating secure database...", { style: { borderRadius: '12px', background: '#333', color: '#fff' } });
    try {
      setTimeout(() => {
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        toast.success("Biometrics synced successfully!", { id: toastId, icon: '🚀' });
      }, 1200); 
    } catch (error) {
      toast.error("Sync failure", { id: toastId });
    }
  };

/* ================= CHAT LOGIC ================= */
// Notice the 'async' keyword added here
const handleSendMessage = async () => {
  if (!inputValue.trim()) return; 

  const userText = inputValue.trim();

  const userMessage = {
    id: Date.now(), 
    text: userText,
    sender: "user",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
  };

  setMessages((prev) => [...prev, userMessage]);
  setInputValue(""); 
  setIsTyping(true); // Trigger the futuristic dot animation

  // WAIT for the Hugging Face API to process and respond
  const aiReply = await getBotResponse(userText);
    
  const botMessage = {
    id: Date.now() + 1,
    text: aiReply,
    sender: "system",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
    
  setIsTyping(false); // Stop the dot animation
  setMessages((prev) => [...prev, botMessage]);
};

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteMessage = (idToRemove) => {
    setMessages((prev) => prev.filter(msg => msg.id !== idToRemove));
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Uploading visual data...", { style: { borderRadius: '12px' } });

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: uploadData }
      );

      const data = await res.json();
      if (!data.secure_url) throw new Error("Upload failed");

      const updatedUser = { ...user, avatar: data.secure_url };
      setUser(updatedUser); 
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Avatar construct updated", { id: toastId });
    } catch (err) {
      toast.error("Uplink failed", { id: toastId });
    }
  };

  if (!user) return null;

  return (
    <div 
      className="h-screen w-full bg-[#0a0f1c] dark:bg-[#050811] flex overflow-hidden text-base-content selection:bg-primary/50 selection:text-white p-3 md:p-5 gap-5 relative font-sans"
      style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* HUD Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
      
      {/* Floating Neon Orbs */}
      <motion.div animate={{ x: [0, 50, 0], y: [0, 30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-[150px] pointer-events-none"></motion.div>
      <motion.div animate={{ x: [0, -50, 0], y: [0, -30, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-accent/20 blur-[150px] pointer-events-none"></motion.div>

      {/* ================= CYBER SIDEBAR ================= */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? "88px" : "280px" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-full relative z-20 bg-white/5 dark:bg-[#0c1222]/80 backdrop-blur-xl border border-white/10 flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.3)] rounded-[2rem] overflow-hidden shrink-0"
      >
        <div className="p-7 flex items-center justify-between min-h-[104px] shrink-0 border-b border-white/5">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div key="title" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10, transition: { duration: 0.15 } }} className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ rotate: 90, scale: 1.1, boxShadow: "0 0 20px rgba(var(--color-primary), 0.6)" }}
                  className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg cursor-pointer transition-all duration-300"
                >
                  <FiTerminal className="text-white" size={20} />
                </motion.div>
                <h1 className="text-xl font-black tracking-widest uppercase bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">ChatVerse</h1>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            animate={{ rotate: collapsed ? 180 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} onClick={() => setCollapsed(!collapsed)}
            className="btn btn-sm btn-circle btn-ghost bg-white/5 hover:bg-white/10 hover:scale-110 text-white/60 hover:text-white absolute right-6 z-50 border-0 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            {collapsed ? <FiMenu size={16} /> : <FiChevronLeft size={18} />}
          </motion.button>
        </div>

        <motion.ul 
          variants={menuContainerAnim}
          initial="hidden"
          animate="visible"
          className="menu px-4 py-4 gap-3 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
        >
          <motion.li variants={menuItemAnim} whileHover={{ scale: 1.03, x: 5 }} whileTap={{ scale: 0.95 }}>
            <button 
              onClick={() => setActive("profile")} 
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all w-full relative group overflow-hidden ${ active === "profile" ? "text-white shadow-[0_10px_30px_rgba(var(--color-primary),0.3)]" : "text-white/50 hover:text-white font-medium" }`}
            >
              {active === "profile" && (
                <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80 rounded-2xl" initial={false} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                   <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-r-2xl opacity-50 shadow-[0_0_10px_white]"></div>
                </motion.div>
              )}
              <div className="relative z-10 flex items-center gap-4 w-full">
                <FiUser size={22} className={`shrink-0 transition-all duration-300 ${active === "profile" ? "text-white drop-shadow-[0_0_8px_white]" : "group-hover:text-primary group-hover:scale-110"}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span variants={textAnim} initial="hidden" animate="visible" exit="hidden" className="whitespace-nowrap overflow-hidden tracking-wider font-bold uppercase text-[13px]">Main Hub</motion.span>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </motion.li>

          <motion.li variants={menuItemAnim} whileHover={{ scale: 1.03, x: 5 }} whileTap={{ scale: 0.95 }}>
            <button 
              onClick={() => setActive("chat")} 
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all w-full relative group overflow-hidden ${ active === "chat" ? "text-white shadow-[0_10px_30px_rgba(var(--color-primary),0.3)]" : "text-white/50 hover:text-white font-medium" }`}
            >
              {active === "chat" && (
                <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-gradient-to-r from-primary/80 to-accent/80 rounded-2xl" initial={false} transition={{ type: "spring", stiffness: 300, damping: 30 }}>
                   <div className="absolute right-0 top-0 bottom-0 w-1 bg-white rounded-r-2xl opacity-50 shadow-[0_0_10px_white]"></div>
                </motion.div>
              )}
              <div className="relative z-10 flex items-center gap-4 w-full">
                <FiMessageSquare size={22} className={`shrink-0 transition-all duration-300 ${active === "chat" ? "text-white drop-shadow-[0_0_8px_white]" : "group-hover:text-primary group-hover:scale-110"}`} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span variants={textAnim} initial="hidden" animate="visible" exit="hidden" className="whitespace-nowrap overflow-hidden tracking-wider font-bold uppercase text-[13px]">Comms</motion.span>
                  )}
                </AnimatePresence>
              </div>
            </button>
          </motion.li>
        </motion.ul>

        <div className="p-5 shrink-0 border-t border-white/5">
          <motion.button 
            whileHover={{ scale: 1.03, x: 5, backgroundColor: "rgba(239, 68, 68, 0.15)", boxShadow: "0 0 15px rgba(239, 68, 68, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout} 
            className="flex items-center justify-center gap-3 w-full p-3.5 rounded-2xl text-white/50 hover:text-error transition-all duration-300 font-bold uppercase tracking-widest text-[13px] group overflow-hidden border border-transparent hover:border-error/30"
          >
            <FiLogOut size={20} className="shrink-0 group-hover:scale-110 transition-all duration-300 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span variants={textAnim} initial="hidden" animate="visible" exit="hidden" className="whitespace-nowrap overflow-hidden">Disconnect</motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="h-full flex-1 bg-white/5 dark:bg-[#0c1222]/60 backdrop-blur-2xl rounded-[2rem] shadow-[0_0_60px_rgba(0,0,0,0.5)] border border-white/10 p-6 md:p-10 flex flex-col overflow-hidden z-10 relative">
        <AnimatePresence mode="wait" className="h-full w-full">
          
          {/* ================= FUTURISTIC PROFILE VIEW ================= */}
          {active === "profile" && (
             <motion.div key="profile" variants={pageAnim} initial="hidden" animate="visible" exit="exit" className="h-full flex flex-col w-full max-w-5xl mx-auto">
               <motion.div variants={itemAnim} className="flex items-center justify-between mb-8 shrink-0 relative">
                 <div className="relative z-10">
                   <h2 className="text-4xl font-black tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">ID CONSTRUCT</h2>
                   <p className="text-primary mt-1 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_var(--color-primary)]"></span>
                      System Parameters
                   </p>
                 </div>
               </motion.div>

               <div className="grid lg:grid-cols-3 gap-8 flex-1 min-h-0 items-start overflow-y-auto pr-2 custom-scrollbar pb-10">
                 
                 {/* Cyber Avatar Card */}
                 <motion.div variants={itemAnim} className="bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 text-center flex flex-col items-center relative overflow-hidden transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_40px_rgba(var(--color-primary),0.2)] group">
                   {/* HUD Corner Accents */}
                   <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/20 group-hover:border-primary transition-colors"></div>
                   <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/20 group-hover:border-primary transition-colors"></div>
                   <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/20 group-hover:border-primary transition-colors"></div>
                   <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/20 group-hover:border-primary transition-colors"></div>

                   <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                   
                   <div className="relative w-40 h-40 mb-6 mt-2">
                     {/* Rotating Cyber Rings */}
                     <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-t-2 border-l-2 border-primary/70 shadow-[0_0_15px_rgba(var(--color-primary),0.5)]"></motion.div>
                     <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-[-12px] rounded-full border-b-2 border-r-2 border-accent/70 border-dashed"></motion.div>
                     
                     <div className="absolute inset-2 bg-black rounded-full overflow-hidden border-[4px] border-[#0a0f1c] z-10">
                       <img src={user.avatar ? `${user.avatar}?t=${Date.now()}` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt="avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100" />
                     </div>

                     <motion.label whileHover={{ scale: 1.15, rotate: 90 }} whileTap={{ scale: 0.9 }} className="absolute bottom-0 right-0 z-20 bg-primary text-white p-3 rounded-xl shadow-[0_0_20px_rgba(var(--color-primary),0.8)] cursor-pointer transition-all border border-white/20">
                       <FiCamera size={18} />
                       <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
                     </motion.label>
                   </div>
                   
                   <h3 className="text-2xl font-black tracking-tight text-white uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{user.name}</h3>
                   <p className="text-white/40 text-sm font-medium mt-1 mb-6 font-mono">{user.email}</p>
                   
                   <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm bg-success/10 border border-success/30 text-success text-xs font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(0,255,100,0.1)]">
                     <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                     </span>
                     Signal Online
                   </div>
                 </motion.div>

                 {/* System Parameters Details Card */}
                 <motion.div variants={itemAnim} className="lg:col-span-2 bg-black/20 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group hover:border-white/20 transition-all">
                   <div className="absolute right-0 top-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] pointer-events-none"></div>

                   <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                     <h3 className="text-xl font-bold tracking-widest text-white flex items-center gap-3 uppercase">
                       <FiUser className="text-primary drop-shadow-[0_0_8px_var(--color-primary)]" /> 
                       Data Matrix
                     </h3>
                     {!isEditing && (
                       <motion.button whileHover={{ scale: 1.05, backgroundColor: "rgba(var(--color-primary), 0.2)" }} whileTap={{ scale: 0.95 }} onClick={handleEditClick} className="btn btn-sm bg-white/5 text-white border border-white/10 rounded-lg px-5 font-bold uppercase tracking-wider text-xs transition-all shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                         <FiEdit2 size={12} className="mr-2" /> Modify
                       </motion.button>
                     )}
                   </div>

                   <motion.div variants={formContainerAnim} initial="hidden" animate="visible" className="space-y-6">
                     <div className="grid md:grid-cols-2 gap-8">
                       
                       <motion.div variants={formItemAnim} className="flex flex-col gap-2 relative">
                         <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] pl-1 drop-shadow-[0_0_5px_rgba(var(--color-primary),0.5)]">Operator Name</label>
                         <input type="text" name="name" value={isEditing ? formData.name : user.name} onChange={handleInputChange} disabled={!isEditing} 
                           className={`w-full px-5 py-4 rounded-xl text-sm font-bold transition-all duration-300 ${ isEditing ? "bg-black/50 border border-primary text-white shadow-[0_0_15px_rgba(var(--color-primary),0.3)] outline-none" : "bg-white/5 border border-transparent text-white/70 px-4 disabled:opacity-100 cursor-default"}`} />
                           {isEditing && <div className="absolute bottom-0 left-4 w-12 h-[2px] bg-primary shadow-[0_0_10px_var(--color-primary)] animate-pulse"></div>}
                       </motion.div>
                       
                       <motion.div variants={formItemAnim} className="flex flex-col gap-2 relative">
                         <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] pl-1 drop-shadow-[0_0_5px_rgba(var(--color-primary),0.5)]">Comms Frequency</label>
                         <input type="text" name="phone" value={isEditing ? formData.phone : (user.phone || "")} onChange={handleInputChange} disabled={!isEditing} placeholder={isEditing ? "Enter connection digits" : "UNREGISTERED"} 
                           className={`w-full px-5 py-4 rounded-xl text-sm font-bold transition-all duration-300 ${ isEditing ? "bg-black/50 border border-primary text-white shadow-[0_0_15px_rgba(var(--color-primary),0.3)] outline-none" : "bg-white/5 border border-transparent text-white/70 px-4 disabled:opacity-100 cursor-default"}`} />
                           {isEditing && <div className="absolute bottom-0 left-4 w-12 h-[2px] bg-primary shadow-[0_0_10px_var(--color-primary)] animate-pulse"></div>}
                       </motion.div>
                       
                       <motion.div variants={formItemAnim} className="flex flex-col gap-2 md:col-span-2">
                         <label className="text-[10px] font-black text-primary uppercase tracking-[0.2em] pl-1 drop-shadow-[0_0_5px_rgba(var(--color-primary),0.5)]">Network Identity (Email)</label>
                         <div className="relative flex items-center">
                           <input type="email" value={user.email} disabled className="w-full bg-black/30 border border-white/5 text-white/50 px-5 py-4 rounded-xl text-sm font-bold font-mono cursor-not-allowed" />
                           <span className="absolute right-5 text-[10px] font-black tracking-widest text-success flex items-center gap-1.5 uppercase drop-shadow-[0_0_5px_rgba(0,255,100,0.5)]"><FiCheck size={14} /> Encrypted</span>
                         </div>
                       </motion.div>

                     </div>
                     
                     <AnimatePresence>
                       {isEditing && (
                         <motion.div initial={{ opacity: 0, height: 0, filter: "blur(10px)" }} animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }} exit={{ opacity: 0, height: 0, filter: "blur(10px)" }} className="flex justify-end gap-4 pt-8 border-t border-white/10 overflow-hidden">
                           <motion.button whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.95 }} onClick={handleCancelEdit} className="px-6 py-3 rounded-lg font-bold text-white/50 hover:text-white uppercase tracking-widest text-xs transition-colors border border-transparent hover:border-white/20">
                             Abort
                           </motion.button>
                           <motion.button whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(var(--color-primary), 0.6)" }} whileTap={{ scale: 0.95 }} onClick={handleSaveChanges} className="px-8 py-3 rounded-lg font-black bg-primary text-white hover:brightness-125 shadow-[0_0_15px_rgba(var(--color-primary),0.4)] transition-all flex items-center gap-2 uppercase tracking-widest text-xs border border-primary-content/20">
                             <FiCheck size={14} /> Execute Save
                           </motion.button>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </motion.div>
                 </motion.div>
               </div>
             </motion.div>
          )}

          {/* ================= FUTURISTIC CHAT VIEW ================= */}
          {active === "chat" && (
             <motion.div key="chat" variants={pageAnim} initial="hidden" animate="visible" exit="exit" className="h-full flex flex-col w-full max-w-5xl mx-auto relative">
               
               {/* Cyber Header */}
               <motion.div variants={itemAnim} className="flex items-center justify-between mb-4 shrink-0 bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl p-4 px-6 shadow-[0_10px_30px_rgba(0,0,0,0.3)] relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                 <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
                 
                 <div className="flex items-center gap-5 relative z-10">
                   <div className="w-16 h-16 relative flex items-center justify-center">
                     {/* Cybernetics Scanning Ring */}
                     <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute inset-0 rounded-full border border-primary/30 border-t-primary shadow-[0_0_15px_rgba(var(--color-primary),0.5)]" />
                     <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 5, ease: "linear" }} className="absolute inset-1 rounded-full border border-accent/20 border-b-accent" />
                     
                     <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center overflow-hidden z-10">
                       <img alt="System Bot" src="https://api.dicebear.com/7.x/bottts/svg?seed=system&backgroundColor=transparent" className="w-10 h-10 transform scale-125 opacity-90 filter drop-shadow-[0_0_5px_white]" />
                     </div>
                   </div>
                   <div>
                     <h2 className="text-xl font-black tracking-widest uppercase leading-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">System Core</h2>
                     <p className="text-[10px] text-primary font-mono tracking-[0.2em] flex items-center gap-2 mt-1 uppercase">
                       <span className="relative flex h-1.5 w-1.5 bg-primary shadow-[0_0_8px_var(--color-primary)]"></span>
                       Uplink Established
                     </p>
                   </div>
                 </div>
               </motion.div>
               
               {/* Chat Matrix Area */}
               <motion.div variants={itemAnim} className="flex-1 min-h-0 bg-black/20 backdrop-blur-md border border-white/10 shadow-inner rounded-2xl flex flex-col overflow-hidden relative">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-screen"></div>

                 <div ref={chatContainerRef} className="flex-1 p-6 space-y-8 overflow-y-auto custom-scrollbar relative z-10">
                   <AnimatePresence initial={false}>
                     {messages.map((msg) => (
                       <motion.div 
                         key={msg.id}
                         layout 
                         variants={messageAnim}
                         initial="hidden"
                         animate="visible"
                         exit="exit"
                         whileHover={{ scale: 1.02, originX: msg.sender === "user" ? 1 : 0 }} 
                         className={`group flex flex-col gap-1.5 max-w-[85%] ${msg.sender === "user" ? "items-end self-end ml-auto" : "items-start"}`}
                       >
                         <span className={`text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] flex items-center gap-2 ${msg.sender === "user" ? "mr-1 flex-row-reverse" : "ml-1"}`}>
                           {msg.sender === "user" ? "Operator" : "System"} 
                           <span className="w-1 h-1 bg-white/20 rounded-full"></span> 
                           {msg.time}
                         </span>
                         
                         <div className={`flex items-end gap-3 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                           
                           {/* Decorative Tech Nodes */}
                           <div className="w-2 h-2 rounded-sm bg-white/10 mb-2 shadow-[0_0_5px_rgba(255,255,255,0.2)]"></div>

                           <div className={`px-6 py-4 text-[15px] font-medium leading-relaxed tracking-wide relative overflow-hidden ${
                             msg.sender === "user" 
                               ? "bg-gradient-to-br from-primary/90 to-accent/90 text-white rounded-2xl rounded-tr-none shadow-[0_0_20px_rgba(var(--color-primary),0.3)] border border-white/20" 
                               : "bg-white/5 backdrop-blur-xl text-white/90 rounded-2xl rounded-tl-none border border-white/10 shadow-[0_5px_15px_rgba(0,0,0,0.3)]"
                           }`}>
                             {/* Scanline effect on bubbles */}
                             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[200%] animate-[scan_3s_linear_infinite] pointer-events-none mix-blend-overlay"></div>
                             {msg.text}
                           </div>

                           {msg.sender === "user" && (
                             <motion.button 
                               whileHover={{ scale: 1.2, rotate: 10 }}
                               whileTap={{ scale: 0.9 }}
                               onClick={() => handleDeleteMessage(msg.id)}
                               className="opacity-0 group-hover:opacity-100 p-2 text-error/80 hover:text-error hover:bg-error/20 rounded-lg transition-all duration-200 shadow-[0_0_10px_rgba(239,68,68,0.2)]"
                               title="Purge Data"
                             >
                               <FiTrash2 size={16} />
                             </motion.button>
                           )}
                         </div>
                       </motion.div>
                     ))}

                     {/* ======= TYPING INDICATOR (FUTURISTIC DOTS) ======= */}
                     {isTyping && (
                       <motion.div 
                         initial={{ opacity: 0, y: 20, scale: 0.8, transformOrigin: "bottom left" }} 
                         animate={{ opacity: 1, y: 0, scale: 1 }} 
                         exit={{ opacity: 0, scale: 0.8, y: 10 }} 
                         className="flex flex-col gap-1.5 max-w-[85%] items-start group"
                       >
                          <span className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] ml-1">System • Processing</span>
                          <div className="flex items-end gap-3">
                            <div className="w-2 h-2 rounded-sm bg-primary/50 mb-2 animate-pulse"></div>
                            <div className="px-6 py-5 bg-white/5 backdrop-blur-xl rounded-2xl rounded-tl-none border border-primary/30 shadow-[0_0_20px_rgba(var(--color-primary),0.1)] flex gap-2 relative overflow-hidden">
                              <motion.span animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]" />
                              <motion.span animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }} className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]" />
                              <motion.span animate={{ y: [0, -6, 0], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }} className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_8px_var(--color-primary)]" />
                            </div>
                          </div>
                       </motion.div>
                     )}
                   </AnimatePresence>
                 </div>

                 {/* Command Input Area */}
                 <div className="p-5 bg-black/40 backdrop-blur-3xl border-t border-white/10 shrink-0 z-20">
                   <div className="relative flex items-center bg-black/50 border border-white/10 rounded-xl p-2 focus-within:bg-black focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all duration-300 shadow-inner group">
                     {/* Decorative corner brackets */}
                     <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-white/30 group-focus-within:border-primary transition-colors"></div>
                     <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-white/30 group-focus-within:border-primary transition-colors"></div>

                     <FiTerminal className="text-primary/50 ml-3 mr-2 group-focus-within:text-primary transition-colors" size={18} />
                     
                     <input 
                       type="text" 
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       onKeyDown={handleKeyDown}
                       placeholder="Enter command sequence..." 
                       className="flex-1 bg-transparent px-2 py-3 text-[15px] font-mono tracking-wide outline-none text-white placeholder-white/20" 
                     />
                     <motion.button 
                       whileHover={inputValue.trim() ? { scale: 1.05, boxShadow: "0 0 20px rgba(var(--color-primary), 0.6)" } : {}}
                       whileTap={inputValue.trim() ? { scale: 0.95 } : {}}
                       onClick={handleSendMessage}
                       className={`rounded-lg px-8 py-3 text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
                         inputValue.trim() 
                         ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(var(--color-primary),0.4)] hover:brightness-125 cursor-pointer" 
                         : "bg-white/5 text-white/20 border-white/5 shadow-none cursor-not-allowed"
                       }`}
                       disabled={!inputValue.trim()} 
                     >
                       Transmit
                     </motion.button>
                   </div>
                 </div>
               </motion.div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Global CSS for custom animations & hiding scrollbars */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(50%); }
        }
        
        /* === HIDE SCROLLBAR CSS === */
        .custom-scrollbar::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
        .custom-scrollbar {
          -ms-overflow-style: none; /* Internet Explorer 10+ */
          scrollbar-width: none; /* Firefox */
        }
      `}} />
    </div>
  );
};

export default UserDashboard;