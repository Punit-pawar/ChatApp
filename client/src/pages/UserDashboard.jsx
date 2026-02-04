import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-base-200 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-base-100 border-r border-base-300 hidden md:flex flex-col">
        <div className="p-5 border-b border-base-300">
          <h1 className="text-2xl font-bold">Chat Verse 💬</h1>
          <p className="text-sm text-base-content/60">
            Welcome back
          </p>
        </div>

        <div className="p-4 flex-1">
          <div className="menu rounded-box">
            <li className="menu-title">Menu</li>
            <li><a className="active">Dashboard</a></li>
            <li><a>Chats</a></li>
            <li><a>Profile</a></li>
            <li><a>Settings</a></li>
          </div>
        </div>

        <div className="p-4 border-t border-base-300">
          <button
            onClick={handleLogout}
            className="btn btn-error btn-outline w-full"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
            Dashboard 🚀
          </h2>

          <div className="flex items-center gap-3">
            <span className="badge badge-success gap-1">
              <span className="w-2 h-2 bg-success rounded-full"></span>
              Online
            </span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* User Profile */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h3 className="text-xl font-semibold mb-3">
                Profile 👤
              </h3>

              <div className="space-y-2">
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
              </div>
            </div>
          </div>

          {/* Chat Preview */}
          <div className="card bg-base-100 shadow-md">
            <div className="card-body">
              <h3 className="text-xl font-semibold mb-3">
                Recent Chats 💬
              </h3>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-base-200">
                  <p className="font-medium">👋 Welcome to Chat Verse</p>
                  <p className="text-sm text-base-content/60">
                    Start your first conversation!
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-base-200 opacity-70">
                  <p className="font-medium">🤖 System</p>
                  <p className="text-sm text-base-content/60">
                    More features coming soon
                  </p>
                </div>
              </div>

              <button className="btn btn-primary mt-4 w-full">
                Open Chats
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
