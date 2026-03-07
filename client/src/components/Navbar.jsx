import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();

  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
    localStorage.setItem("chit-chatTheme", selectedTheme);
    document.documentElement.setAttribute("data-theme", selectedTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("chit-chatTheme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    setTheme(savedTheme);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 px-6 py-4 transition-all duration-500 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-3xl font-black tracking-tight cursor-pointer bg-primary bg-clip-text text-transparent drop-shadow-sm transition-all duration-300 hover:scale-[1.03] hover:-rotate-1"
        >
          ChatVerse
        </h1>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 font-semibold text-base-content/80 text-sm tracking-wide">
          <span
            onClick={() => navigate("/")}
            className="cursor-pointer relative group transition-colors duration-300 hover:text-primary"
          >
            Home
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
          </span>

          <span
            onClick={() => navigate("/about")}
            className="cursor-pointer relative group transition-colors duration-300 hover:text-primary"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          
          <button
            className="btn btn-ghost btn-sm px-4 transition-all duration-300 hover:bg-primary/10 hover:text-primary hover:scale-105 active:scale-95"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="btn btn-sm px-6 border-none bg-primary text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
            onClick={() => navigate("/register")}
          >
            Register
          </button>

          <div className="h-6 w-[1px] bg-base-content/20 mx-1 hidden sm:block"></div>

          <select
            className="select select-bordered select-sm bg-base-100/50 min-w-[130px] font-medium transition-all duration-300 cursor-pointer hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            onChange={handleThemeChange}
            value={theme}
          >
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
      </div>
    </nav>
  );
};

export default NavBar;