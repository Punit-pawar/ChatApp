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
    <nav className="bg-primary px-6 py-3 shadow-md backdrop-blur-md transition-all duration-300">
      <div className="flex items-center justify-between max-w-7xl mx-auto">

        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="
          text-2xl 
          font-extrabold 
          tracking-wide 
          cursor-pointer
          text-primary-content
          transition-all duration-300
          hover:scale-105
          hover:tracking-widest
          "
        >
          ChatVerse
        </h1>

        {/* Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-primary-content">
          
          <span
            onClick={() => navigate("/")}
            className="
            cursor-pointer
            transition-all duration-300
            hover:text-secondary
            hover:scale-105
            relative
            after:absolute
            after:left-0
            after:-bottom-1
            after:w-0
            after:h-[2px]
            after:bg-secondary
            after:transition-all
            after:duration-300
            hover:after:w-full
            "
          >
            Home
          </span>

          <span
            onClick={() => navigate("/about")}
            className="
            cursor-pointer
            transition-all duration-300
            hover:text-secondary
            hover:scale-105
            relative
            after:absolute
            after:left-0
            after:-bottom-1
            after:w-0
            after:h-[2px]
            after:bg-secondary
            after:transition-all
            after:duration-300
            hover:after:w-full
            "
          >
            About
          </span>

        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">

          <button
            className="
            btn-secondary1
            transition-all duration-300
            hover:scale-105
            active:scale-95
            shadow-sm hover:shadow-md
            "
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="
            btn btn-outline btn-sm px-5
            transition-all duration-300
            hover:scale-105
            active:scale-95
            shadow-sm hover:shadow-md
            "
            onClick={() => navigate("/register")}
          >
            Register
          </button>

          <select
            className="
            select select-bordered select-sm min-w-[130px]
            transition-all duration-300
            hover:scale-105
            focus:outline-none
            focus:ring-2
            focus:ring-primary
            "
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