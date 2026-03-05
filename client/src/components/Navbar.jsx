import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiMessageSquare, FiLogOut, FiUser } from "react-icons/fi";

const themes = [
  { value: "", label: "🎨 Default" },
  { value: "light", label: "☀️ Light" },
  { value: "dark", label: "🌙 Dark" },
  { value: "spotify", label: "🎵 Spotify" },
  { value: "vscode", label: "💻 VSCode" },
  { value: "black", label: "⬛ Black" },
  { value: "luxury", label: "💎 Luxury" },
  { value: "mintlify", label: "🌿 Mintlify" },
  { value: "pastel", label: "🌸 Pastel" },
  { value: "shadcn", label: "🔷 Shadcn" },
  { value: "valorant", label: "🔥 Valorant" },
  { value: "claude", label: "🤖 Claude" },
  { value: "soft", label: "🌼 Soft" },
  { value: "perplexity", label: "🔮 Perplexity" },
  { value: "corporate", label: "🏢 Corporate" },
];

const Navbar = () => {
  const [theme, setTheme] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")); }
    catch { return null; }
  })();

  useEffect(() => {
    const stored = localStorage.getItem("chatKaroTheme") || "";
    document.documentElement.setAttribute("data-theme", stored);
    setTheme(stored);
  }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleThemeChange = (val) => {
    setTheme(val);
    localStorage.setItem("chatKaroTheme", val);
    document.documentElement.setAttribute("data-theme", val);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
    setOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className={`fixed top-0 left-0 right-0 z-50 px-5 md:px-10 transition-all duration-500 ${scrolled
            ? "py-3 bg-[#050811]/90 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
            : "py-5 bg-transparent"
          }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30"
            >
              <FiMessageSquare className="text-white" size={18} />
            </motion.div>
            <motion.span
              whileHover={{ x: 2 }}
              className="text-xl font-black tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent"
            >
              ChatVerse
            </motion.span>
          </Link>

          {/* CENTER NAV (desktop) */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { to: "/", label: "Home" },
              { to: "/dashboard", label: "Dashboard" },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "text-white bg-white/10" : "text-white/50 hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* RIGHT ACTIONS (desktop) */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Picker */}
            <div className="relative group">
              <button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
                🎨 <span className="hidden lg:inline">Theme</span>
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 py-2 rounded-2xl bg-[#0c1222]/95 backdrop-blur-xl border border-white/10 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right scale-95 group-hover:scale-100">
                {themes.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleThemeChange(value)}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${theme === value ? "text-primary font-bold" : "text-white/60"
                      }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {user ? (
              <>
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
                  >
                    <img
                      src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                      className="w-5 h-5 rounded-full object-cover"
                      alt="avatar"
                    />
                    {user.name?.split(" ")[0]}
                  </motion.button>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium"
                >
                  <FiLogOut size={14} /> Logout
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2 rounded-xl text-sm font-semibold text-white/60 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    Login
                  </motion.button>
                </Link>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(var(--color-primary),0.5)" }}
                    whileTap={{ scale: 0.97 }}
                    className="px-5 py-2 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/30 transition-all"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BTN */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            className="md:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
            onClick={() => setOpen(!open)}
          >
            <AnimatePresence mode="wait">
              <motion.div key={open ? "x" : "menu"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                {open ? <FiX size={18} /> : <FiMenu size={18} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.nav>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-[#0c1222]/98 backdrop-blur-2xl border-l border-white/10 z-50 md:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <span className="text-lg font-black text-white">Menu</span>
                <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-white/50 hover:text-white">
                  <FiX size={16} />
                </button>
              </div>

              <div className="flex-1 p-6 flex flex-col gap-3 overflow-y-auto">
                {[
                  { to: "/", label: "🏠 Home" },
                  { to: "/dashboard", label: " Dashboard" },
                  { to: "/login", label: " Login" },
                  { to: "/signup", label: " Sign Up" },
                ].map(({ to, label }, i) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <NavLink
                      to={to}
                      onClick={() => setOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-primary/20 text-primary border border-primary/30" : "text-white/60 hover:text-white hover:bg-white/5"
                        }`
                      }
                    >
                      {label}
                    </NavLink>
                  </motion.div>
                ))}

                {user && (
                  <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      🚪 Logout
                    </button>
                  </motion.div>
                )}

                <div className="mt-4 pt-4 border-t border-white/5">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/20 mb-3 px-1">Theme</p>
                  <div className="grid grid-cols-2 gap-2">
                    {themes.slice(0, 8).map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => handleThemeChange(value)}
                        className={`px-3 py-2 rounded-xl text-xs transition-all text-left truncate ${theme === value ? "bg-primary/20 text-primary border border-primary/30 font-bold" : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                          }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer so content doesn't hide behind navbar */}
      <div className="h-20" />
    </>
  );
};

export default Navbar;