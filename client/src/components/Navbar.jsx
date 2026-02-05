import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion } from "framer-motion";

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
    <div className="navbar bg-base-100 border-b border-base-300 sticky top-0 z-50 px-4 md:px-8">

      {/* LEFT */}
      <div className="flex-1">
        <motion.h1
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-extrabold tracking-tight"
        >
          <Link to="/" className="flex items-center gap-2">
            💬 <span>Chat Verse</span>
          </Link>
        </motion.h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

         {/* AUTH BUTTONS (Desktop) */}
        <div className="hidden md:flex gap-2">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="btn btn-gradient btn-sm"
            >
              Login
            </motion.button>
          </Link>

          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="btn btn-primary btn-sm"
            >
              Signup
            </motion.button>
          </Link>
        </div>

        {/* THEME SELECT */}
        <select
          name="theme"
          className="btn btn-outline text-center select select-sm hidden sm:block"
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

       

        {/* MOBILE MENU BUTTON */}
        <button
          className="btn btn-ghost md:hidden"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-base-100 border-t border-base-300 md:hidden"
        >
          <div className="flex flex-col p-4 gap-4">
            <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>

            <Link to="/login" onClick={() => setOpen(false)}>
              <button className="btn btn-gradient w-full">Login</button>
            </Link>

            <Link to="/signup" onClick={() => setOpen(false)}>
              <button className="btn btn-primary w-full">Signup</button>
            </Link>

            <select
              className="select select-bordered"
              onChange={handleThemeChange}
              value={theme}>
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
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Navbar;
