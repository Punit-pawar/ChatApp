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
  FiTrash2 
} from "react-icons/fi";

/* ================= CLOUDINARY CONFIG ================= */
const CLOUD_NAME = "YOUR_CLOUD_NAME"; 
const UPLOAD_PRESET = "chatverse_profile"; 

/* ================= PREMIUM ANIMATIONS ================= */
const pageAnim = {
  hidden: { opacity: 0, y: 15, scale: 0.99 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: "spring", stiffness: 100, damping: 20, staggerChildren: 0.05 } 
  },
  exit: { opacity: 0, y: -10, scale: 0.99, transition: { duration: 0.2 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 20 } }
};

const textAnim = {
  hidden: { opacity: 0, width: 0, x: -10, transition: { duration: 0.2, ease: "easeInOut" } },
  visible: { opacity: 1, width: "auto", x: 0, transition: { duration: 0.3, ease: "easeOut", delay: 0.05 } }
};

const messageAnim = {
  hidden: { opacity: 0, y: 30, scale: 0.8, transformOrigin: "bottom right" },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 400, damping: 25 } },
  exit: { opacity: 0, scale: 0.8, y: 10, transition: { duration: 0.2 } } 
};

/* ================= SMART BOT LOGIC ================= */
// This function analyzes the user's message and returns a context-aware response
const getBotResponse = (userMessage) => {
  const msg = userMessage.toLowerCase();

  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey")) {
    return "Hello there! 👋 How are you doing today?";
  } 
  else if (msg.includes("how are you")) {
    return "I'm just a few lines of code, but I'm feeling fantastic! Thanks for asking. How can I help?";
  }
  else if (msg.includes("help") || msg.includes("support")) {
    return "I can help you navigate ChatVerse. Try updating your profile in the 'My Profile' tab, or testing out the chat features here!";
  }
  else if (msg.includes("name") || msg.includes("who are you")) {
    return "I am the ChatVerse System Assistant. I'm here to ensure everything runs smoothly. 🤖";
  }
  else if (msg.includes("awesome") || msg.includes("great") || msg.includes("good")) {
    return "Glad to hear that! Keep up the great work.";
  }
  else if (msg.includes("thank")) {
    return "You're very welcome! Let me know if you need anything else.";
  }
  else if (msg.includes("bye") || msg.includes("see ya") || msg.includes("goodbye")) {
    return "Goodbye! Have a wonderful day ahead! 👋";
  }
  else {
    // Fallback response if no keywords are matched
    const fallbacks = [
      "That's interesting! Tell me more.",
      "I see. What else is on your mind?",
      "I'm still learning, but I'm tracking what you're saying.",
      "Got it! Message securely encrypted and stored. 🔐"
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
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
  const chatContainerRef = useRef(null); 
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Welcome to ChatVerse! Your secure workspace is ready. How can I help you today? ✨",
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
  }, [messages, active]);

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
    const toastId = toast.loading("Saving changes...", { style: { borderRadius: '12px' } });
    try {
      setTimeout(() => {
        const updatedUser = { ...user, ...formData };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        toast.success("Profile updated successfully!", { id: toastId, icon: '✨' });
      }, 800); 
    } catch (error) {
      toast.error("Failed to update profile", { id: toastId });
    }
  };

  /* ================= CHAT LOGIC (SEND, DELETE, & SMART AUTO-REPLY) ================= */
  const handleSendMessage = () => {
    if (!inputValue.trim()) return; 

    const userText = inputValue.trim(); // Save what the user typed before clearing the input

    // 1. Create and send User Message
    const userMessage = {
      id: Date.now(), 
      text: userText,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue(""); 

    // 2. Simulate Bot Thinking & Responding Intelligently
    setTimeout(() => {
      // Pass the user's text into our smart function
      const smartReply = getBotResponse(userText);
      
      const botMessage = {
        id: Date.now() + 1,
        text: smartReply,
        sender: "system",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages((prev) => [...prev, botMessage]);
    }, 1200); 
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

    const toastId = toast.loading("Uploading photo...", { style: { borderRadius: '12px' } });

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
      toast.success("Profile photo updated", { id: toastId });
    } catch (err) {
      toast.error("Image upload failed", { id: toastId });
    }
  };

  if (!user) return null;

  return (
    <div 
      className="h-screen w-full bg-[#f8fafc] dark:bg-[#0f172a] flex overflow-hidden text-base-content selection:bg-primary/30 selection:text-primary p-3 md:p-5 gap-5 relative font-sans"
      style={{ fontFamily: "'Inter', 'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <div className="absolute top-[-15%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/10 blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[-15%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-secondary/10 blur-[140px] pointer-events-none"></div>

      {/* ================= PREMIUM SIDEBAR ================= */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? "88px" : "280px" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="h-full relative z-20 bg-base-100/50 dark:bg-base-100/40 backdrop-blur-2xl border border-white/40 dark:border-white/5 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] overflow-hidden shrink-0"
      >
        <div className="p-7 flex items-center justify-between min-h-[96px] shrink-0">
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div key="title" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10, transition: { duration: 0.15 } }} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
                  <FiMessageSquare className="text-white" size={16} />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-base-content">ChatVerse</h1>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            animate={{ rotate: collapsed ? 180 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} onClick={() => setCollapsed(!collapsed)}
            className="btn btn-sm btn-circle btn-ghost bg-base-content/5 hover:bg-base-content/10 text-base-content/60 hover:text-base-content absolute right-6 z-50 border-0"
          >
            {collapsed ? <FiMenu size={16} /> : <FiChevronLeft size={18} />}
          </motion.button>
        </div>

        <ul className="menu px-4 py-2 gap-2 flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <motion.li whileTap={{ scale: 0.97 }}>
            <button onClick={() => setActive("profile")} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all w-full relative group ${ active === "profile" ? "bg-base-content/5 dark:bg-base-content/10 text-primary font-semibold" : "text-base-content/60 hover:bg-base-content/5 hover:text-base-content font-medium" }`}>
              {active === "profile" && <motion.div layoutId="active-pill" className="absolute left-0 w-1.5 h-6 bg-primary rounded-r-full" />}
              <FiUser size={20} className={`shrink-0 ${active === "profile" ? "text-primary" : "group-hover:text-base-content"}`} />
              <AnimatePresence>
                {!collapsed && <motion.span variants={textAnim} initial="hidden" animate="visible" exit="hidden" className="whitespace-nowrap overflow-hidden tracking-tight">My Profile</motion.span>}
              </AnimatePresence>
            </button>
          </motion.li>

          <motion.li whileTap={{ scale: 0.97 }}>
            <button onClick={() => setActive("chat")} className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all w-full relative group ${ active === "chat" ? "bg-base-content/5 dark:bg-base-content/10 text-primary font-semibold" : "text-base-content/60 hover:bg-base-content/5 hover:text-base-content font-medium" }`}>
              {active === "chat" && <motion.div layoutId="active-pill" className="absolute left-0 w-1.5 h-6 bg-primary rounded-r-full" />}
              <FiMessageSquare size={20} className={`shrink-0 ${active === "chat" ? "text-primary" : "group-hover:text-base-content"}`} />
              <AnimatePresence>
                {!collapsed && <motion.span variants={textAnim} initial="hidden" animate="visible" exit="hidden" className="whitespace-nowrap overflow-hidden tracking-tight">Messages</motion.span>}
              </AnimatePresence>
            </button>
          </motion.li>
        </ul>

        <div className="p-5 shrink-0">
          <button onClick={handleLogout} className="flex items-center justify-center gap-3 w-full p-3.5 rounded-2xl text-base-content/60 hover:bg-error/10 hover:text-error transition-all duration-300 font-medium group">
            <FiLogOut size={20} className="shrink-0 group-hover:scale-110 transition-transform" />
            <AnimatePresence>
              {!collapsed && <motion.span variants={textAnim} initial="hidden" animate="visible" exit="hidden" className="whitespace-nowrap overflow-hidden">Log out</motion.span>}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="h-full flex-1 bg-base-100/40 dark:bg-base-100/20 backdrop-blur-3xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-white/50 dark:border-white/5 p-6 md:p-10 flex flex-col overflow-hidden z-10 relative">
        <AnimatePresence mode="wait" className="h-full w-full">
          
          {/* ================= PROFILE VIEW ================= */}
          {active === "profile" && (
             <motion.div key="profile" variants={pageAnim} initial="hidden" animate="visible" exit="exit" className="h-full flex flex-col w-full max-w-5xl mx-auto">
               <motion.div variants={itemAnim} className="flex items-center justify-between mb-8 shrink-0">
                 <div>
                   <h2 className="text-3xl font-extrabold tracking-tight drop-shadow-sm text-base-content">Account Settings</h2>
                   <p className="text-base-content/50 mt-1 text-sm font-medium">Manage your profile and preferences.</p>
                 </div>
               </motion.div>

               <div className="grid lg:grid-cols-3 gap-8 flex-1 min-h-0 items-start overflow-y-auto pr-2 custom-scrollbar pb-10">
                 <motion.div variants={itemAnim} className="bg-base-100/70 dark:bg-base-100/50 backdrop-blur-xl border border-white/60 dark:border-white/5 shadow-[0_8px_20px_rgb(0,0,0,0.03)] rounded-[2rem] p-8 text-center flex flex-col items-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/10 to-transparent"></div>
                   <div className="relative w-36 h-36 mb-5 mt-2 group">
                     <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                     <img src={user.avatar ? `${user.avatar}?t=${Date.now()}` : `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} alt="avatar" className="relative rounded-full w-36 h-36 object-cover border-[6px] border-base-100 shadow-xl group-hover:scale-105 transition-transform duration-500 ease-out bg-base-200" />
                     <label className="absolute bottom-1 right-1 bg-primary text-white p-2.5 rounded-full shadow-lg hover:scale-110 hover:bg-primary-focus cursor-pointer transition-all border-4 border-base-100">
                       <FiCamera size={16} />
                       <input type="file" accept="image/*" hidden onChange={handleAvatarUpload} />
                     </label>
                   </div>
                   <h3 className="text-xl font-bold tracking-tight text-base-content">{user.name}</h3>
                   <p className="text-base-content/50 text-sm font-medium mt-1 mb-6">{user.email}</p>
                   <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-success/10 border border-success/20 text-success text-xs font-bold uppercase tracking-widest shadow-sm">
                     <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                     </span>
                     Active Now
                   </div>
                 </motion.div>

                 <motion.div variants={itemAnim} className="lg:col-span-2 bg-base-100/70 dark:bg-base-100/50 backdrop-blur-xl border border-white/60 dark:border-white/5 shadow-[0_8px_20px_rgb(0,0,0,0.03)] rounded-[2rem] p-8 relative overflow-hidden">
                   <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-bold tracking-tight text-base-content flex items-center gap-2"><FiUser className="text-primary" /> Personal Details</h3>
                     {!isEditing && (
                       <button onClick={handleEditClick} className="btn btn-sm bg-base-200 hover:bg-primary/10 text-base-content/70 hover:text-primary border-0 rounded-xl px-4 font-semibold transition-colors">
                         <FiEdit2 size={14} className="mr-1.5" /> Edit
                       </button>
                     )}
                   </div>
                   <div className="space-y-6">
                     <div className="grid md:grid-cols-2 gap-6">
                       <div className="flex flex-col gap-2">
                         <label className="text-[11px] font-bold text-base-content/40 uppercase tracking-widest pl-1">Full Name</label>
                         <input type="text" name="name" value={isEditing ? formData.name : user.name} onChange={handleInputChange} disabled={!isEditing} placeholder="Enter your full name" 
                           className={`w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${ isEditing ? "bg-base-100 border border-base-content/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none shadow-sm" : "bg-transparent border border-transparent text-base-content px-1 disabled:opacity-100 cursor-default"}`} />
                       </div>
                       <div className="flex flex-col gap-2">
                         <label className="text-[11px] font-bold text-base-content/40 uppercase tracking-widest pl-1">Phone Number</label>
                         <input type="text" name="phone" value={isEditing ? formData.phone : (user.phone || "")} onChange={handleInputChange} disabled={!isEditing} placeholder={isEditing ? "+1 (555) 000-0000" : "Not provided"} 
                           className={`w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${ isEditing ? "bg-base-100 border border-base-content/10 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none shadow-sm" : "bg-transparent border border-transparent text-base-content px-1 disabled:opacity-100 cursor-default"}`} />
                       </div>
                       <div className="flex flex-col gap-2 md:col-span-2">
                         <label className="text-[11px] font-bold text-base-content/40 uppercase tracking-widest pl-1">Email Address</label>
                         <div className="relative flex items-center">
                           <input type="email" value={user.email} disabled className="w-full bg-base-200/50 border border-base-content/5 text-base-content/60 px-4 py-3.5 rounded-xl text-sm font-medium cursor-not-allowed" />
                           <span className="absolute right-4 text-xs font-semibold text-base-content/40 flex items-center gap-1"><FiCheck /> Verified</span>
                         </div>
                       </div>
                     </div>
                     <AnimatePresence>
                       {isEditing && (
                         <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "auto", marginTop: 32 }} exit={{ opacity: 0, height: 0, marginTop: 0 }} className="flex justify-end gap-3 pt-4 border-t border-base-content/5 overflow-hidden">
                           <button onClick={handleCancelEdit} className="px-6 py-2.5 rounded-xl font-semibold text-base-content/60 hover:bg-base-content/5 hover:text-base-content transition-colors flex items-center gap-2"><FiX size={16} /> Cancel</button>
                           <button onClick={handleSaveChanges} className="px-6 py-2.5 rounded-xl font-semibold bg-primary text-white hover:bg-primary-focus shadow-lg shadow-primary/30 transition-all active:scale-95 flex items-center gap-2"><FiCheck size={16} /> Save Changes</button>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 </motion.div>
               </div>
             </motion.div>
          )}

          {/* ================= PREMIUM CHAT VIEW ================= */}
          {active === "chat" && (
             <motion.div key="chat" variants={pageAnim} initial="hidden" animate="visible" exit="exit" className="h-full flex flex-col w-full max-w-5xl mx-auto relative">
               
               <motion.div variants={itemAnim} className="flex items-center justify-between mb-6 shrink-0 bg-base-100/50 backdrop-blur-xl border border-white/40 dark:border-white/5 rounded-[2rem] p-4 px-6 shadow-sm">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px]">
                     <div className="w-full h-full bg-base-100 rounded-full flex items-center justify-center overflow-hidden">
                       <img alt="System" src="https://api.dicebear.com/7.x/bottts/svg?seed=system" className="w-10 h-10" />
                     </div>
                   </div>
                   <div>
                     <h2 className="text-lg font-bold tracking-tight leading-tight">System Assistant</h2>
                     <p className="text-xs text-success font-semibold flex items-center gap-1">
                       <span className="w-1.5 h-1.5 rounded-full bg-success"></span> Online
                     </p>
                   </div>
                 </div>
               </motion.div>
               
               <motion.div variants={itemAnim} className="flex-1 min-h-0 bg-base-100/60 backdrop-blur-xl border border-white/40 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[2rem] flex flex-col overflow-hidden relative">
                 
                 <div ref={chatContainerRef} className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar">
                   <AnimatePresence initial={false}>
                     {messages.map((msg) => (
                       <motion.div 
                         key={msg.id}
                         layout 
                         variants={messageAnim}
                         initial="hidden"
                         animate="visible"
                         exit="exit"
                         className={`group flex flex-col gap-1 max-w-[80%] ${msg.sender === "user" ? "items-end self-end ml-auto" : "items-start"}`}
                       >
                         <span className={`text-[10px] font-bold text-base-content/40 uppercase tracking-wider ${msg.sender === "user" ? "mr-1" : "ml-1"}`}>
                           {msg.sender === "user" ? "You" : "System Bot"} • {msg.time}
                         </span>
                         
                         <div className="flex items-center gap-2">
                           {msg.sender === "user" && (
                             <button 
                               onClick={() => handleDeleteMessage(msg.id)}
                               className="opacity-0 group-hover:opacity-100 p-2 text-error/70 hover:text-error hover:bg-error/10 rounded-full transition-all duration-200"
                               title="Delete Message"
                             >
                               <FiTrash2 size={16} />
                             </button>
                           )}

                           <div className={`px-5 py-3.5 text-sm font-medium shadow-sm border ${
                             msg.sender === "user" 
                               ? "bg-primary text-white rounded-2xl rounded-tr-sm shadow-primary/20 border-transparent" 
                               : "bg-base-200 text-base-content rounded-2xl rounded-tl-sm border-base-content/5"
                           }`}>
                             {msg.text}
                           </div>
                         </div>
                       </motion.div>
                     ))}
                   </AnimatePresence>
                 </div>

                 <div className="p-4 bg-base-100/80 backdrop-blur-2xl border-t border-base-content/5 shrink-0">
                   <div className="relative flex items-center bg-base-200/50 border border-base-content/10 rounded-full p-1.5 focus-within:ring-4 focus-within:ring-primary/10 focus-within:border-primary transition-all">
                     <input 
                       type="text" 
                       value={inputValue}
                       onChange={(e) => setInputValue(e.target.value)}
                       onKeyDown={handleKeyDown}
                       placeholder="Type your message..." 
                       className="flex-1 bg-transparent px-5 py-2.5 text-sm font-medium outline-none text-base-content placeholder-base-content/40" 
                     />
                     <button 
                       onClick={handleSendMessage}
                       className="bg-primary hover:bg-primary-focus text-white rounded-full px-6 py-2.5 text-sm font-bold shadow-md shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                       disabled={!inputValue.trim()} 
                     >
                       Send
                     </button>
                   </div>
                 </div>
               </motion.div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default UserDashboard;