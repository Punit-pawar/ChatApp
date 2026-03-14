import React, { useEffect, useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user, isLogin } = useAuth();
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
    <nav className="bg-primary px-6 py-3 shadow-md">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold tracking-wide cursor-pointer">
          Data-Transfer
        </h1>

        {/* Links */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/chatting"> Chat </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isLogin ? (
            <div
              className="flex items-center gap-3 cursor-pointer p-1 border border-primary hover:border-primary-content rounded-md transition"
              onClick={() => navigate("/userDashboard")}
            >
              <span className="text-nowrap text-lg font-semibold">
                Welcome,{" "}
                {user?.fullName.split(" ")[0] || user?.email.split("@")[0]}
              </span>
            </div>
          ) : (
            <>
              <button
                className="btn-secondary1"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                className="btn btn-outline btn-sm px-5"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
          <select
            className="select select-bordered select-sm max-w-32"
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