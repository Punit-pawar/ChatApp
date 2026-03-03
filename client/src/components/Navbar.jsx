import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [theme, setTheme] = useState("");
  const [open, setOpen] = useState(false);

  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
    localStorage.setItem("chatKaroTheme", selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem("chatKaroTheme") || "";
    document.documentElement.setAttribute("data-theme", currentTheme);
    setTheme(currentTheme);
  }, []);

  return (
    <div className="navbar bg-base-100/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-50 px-4 md:px-8 transition-colors duration-300 shadow-sm">
      
      {/* LEFT - LOGO */}
      <div className="flex-1">
        <motion.div
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <motion.span 
              animate={{ rotate: [0, 10, -10, 0] }} 
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
              className="text-2xl"
            >
              💬
            </motion.span>
            <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent group-hover:from-secondary group-hover:to-primary transition-all duration-500">
              Chat Verse
            </span>
          </Link>
        </motion.div>
      </div>

      {/* RIGHT - ACTIONS */}
      <div className="flex items-center gap-4">
        
        {/* THEME SELECT */}
        <motion.div 
          whileHover={{ scale: 1.02 }} 
          whileTap={{ scale: 0.98 }}
          className="hidden sm:block"
        >
          <select
            name="theme"
            className="select select-bordered select-sm bg-base-200/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
            onChange={handleThemeChange}
            value={theme}
          >
            <option value="">Default</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="claude">Claude</option>
            <option value="spotify">Spotify</option>
            <option value="vscode">VSCode</option>
            <option value="black">Black</option>
            <option value="corporate">Corporate</option>
            <option value="ghibli">Ghibli</option>
            <option value="gourmet">Gourmet</option>
            <option value="luxury">Luxury</option>
            <option value="mintlify">Mintlify</option>
            <option value="pastel">Pastel</option>
            <option value="perplexity">Perplexity</option>
            <option value="shadcn">Shadcn</option>
            <option value="slack">Slack</option>
            <option value="soft">Soft</option>
            <option value="valorant">Valorant</option>
          </select>
        </motion.div>

        {/* AUTH BUTTONS (Desktop) */}
        <div className="hidden md:flex gap-3">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 4px 15px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-ghost btn-sm border border-base-300 hover:bg-base-200"
            >
              Login
            </motion.button>
          </Link>

          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0px 4px 15px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary btn-sm shadow-lg hover:shadow-primary/50 transition-shadow"
            >
              Signup
            </motion.button>
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <motion.button
          whileTap={{ scale: 0.8 }}
          className="btn btn-ghost btn-circle md:hidden flex items-center justify-center"
          onClick={() => setOpen(!open)}
        >
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-xl"
          >
            {open ? "✖" : "☰"}
          </motion.div>
        </motion.button>
      </div>

      {/* MOBILE DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full bg-base-100/95 backdrop-blur-xl border-b border-base-300 md:hidden overflow-hidden shadow-2xl origin-top"
          >
            <div className="flex flex-col p-6 gap-4">
              <motion.div 
                initial={{ x: -20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ delay: 0.1 }}
              >
                <NavLink 
                  to="/" 
                  onClick={() => setOpen(false)}
                  className="block text-lg font-medium hover:text-primary transition-colors"
                >
                  Home
                </NavLink>
              </motion.div>
              
              <motion.div 
                initial={{ x: -20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ delay: 0.15 }}
              >
                <NavLink 
                  to="/about" 
                  onClick={() => setOpen(false)}
                  className="block text-lg font-medium hover:text-primary transition-colors"
                >
                  About
                </NavLink>
              </motion.div>

              <motion.div 
                initial={{ x: -20, opacity: 0 }} 
                animate={{ x: 0, opacity: 1 }} 
                transition={{ delay: 0.2 }}
                className="divider my-1"
              ></motion.div>

              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
                <Link to="/login" onClick={() => setOpen(false)}>
                  <button className="btn btn-outline btn-block mb-3">Login</button>
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)}>
                  <button className="btn btn-primary btn-block shadow-lg shadow-primary/30">Signup</button>
                </Link>
              </motion.div>

              <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mt-2">
                <label className="text-xs font-semibold text-base-content/60 uppercase tracking-wider mb-2 block">Theme Preference</label>
                <select
                  className="select select-bordered w-full bg-base-200/50 focus:ring-2 focus:ring-primary/50"
                  onChange={handleThemeChange}
                  value={theme}
                >
                  <option value="">Default</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="claude">Claude</option>
                  <option value="spotify">Spotify</option>
                  <option value="vscode">VSCode</option>
                  <option value="black">Black</option>
                  <option value="corporate">Corporate</option>
                  <option value="ghibli">Ghibli</option>
                  <option value="gourmet">Gourmet</option>
                  <option value="luxury">Luxury</option>
                  <option value="mintlify">Mintlify</option>
                  <option value="pastel">Pastel</option>
                  <option value="perplexity">Perplexity</option>
                  <option value="shadcn">Shadcn</option>
                  <option value="slack">Slack</option>
                  <option value="soft">Soft</option>
                  <option value="valorant">Valorant</option>
                </select>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;