import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [theme, setTheme] = useState("");

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
    localStorage.setItem("chatKaroTheme", event.target.value);
    document.documentElement.setAttribute("data-theme", event.target.value);
  };

  useEffect(() => {
    const currentTheme = localStorage.getItem("chatKaroTheme") || "";
    document.documentElement.setAttribute("data-theme", currentTheme);
    setTheme(currentTheme);
  }, []);

  return (
    <div className="bg-primary flex justify-between items-center px-5 py-2">
      
      <h1 className="text-xl font-bold">Chat Verse</h1>

      <div className="flex gap-4">
        <span className="cursor-pointer">Home</span>
        <span className="cursor-pointer">About</span>
      </div>

      <div className="flex gap-3 items-center">
        
        
        <Link to="/login">
          <button className="btn btn-secondary">Login</button>
        </Link>

        <Link to="/Signup">
          <button className="btn btn-secondary">Signup</button>
        </Link>

        <select
          name="theme"
          id="theme"
          className="select"
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
      </div>
    </div>
  );
};

export default Navbar;
