import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const pageAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20 },
};

const cardHover = {
  whileHover: { scale: 1.03 },
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("dashboard");

  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") === "true",
  );

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) navigate("/login");
    else setUser(JSON.parse(storedUser));
  }, [navigate]);

  /* ---------------- SETTINGS SAVE ---------------- */
  useEffect(() => {
    localStorage.setItem("notifications", notifications);
  }, [notifications]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-base-100/80 backdrop-blur border-r border-base-300 flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-extrabold">Chat Verse 💬</h1>
          <p className="text-sm opacity-70">{user.email}</p>
        </div>

        <ul className="menu p-4 gap-2 flex-1">
          {["dashboard", "chat", "profile", "settings"].map((item) => (
            <li key={item}>
              <button
                onClick={() => setActive(item)}
                className={`capitalize ${
                  active === item && "text-primary font-semibold"
                }`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="btn btn-error btn-outline w-full"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 overflow-hidden">
        <AnimatePresence mode="wait">

          {/* ---------------- DASHBOARD ---------------- */}
          {active === "dashboard" && (
            <motion.div
              key="dashboard"
              variants={pageAnim}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-4xl font-bold mb-8">Dashboard 🚀</h2>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: "Total Chats", value: 0 },
                  { label: "Messages Sent", value: 0 },
                  { label: "Account Status", value: "Active" },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    {...cardHover}
                    className="card bg-base-100 shadow-xl"
                  >
                    <div className="card-body">
                      <p className="text-sm opacity-70">{item.label}</p>
                      <h3 className="text-3xl font-bold">{item.value}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div {...cardHover} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="text-xl font-semibold">Quick Actions</h3>
                  <div className="flex gap-4 mt-4">
                    <button
                      className="btn btn-primary"
                      onClick={() => setActive("chat")}
                    >
                      Start Chat
                    </button>
                    <button className="btn btn-outline">
                      Invite Friends
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ---------------- CHAT ---------------- */}
          {active === "chat" && (
            <motion.div
              key="chat"
              variants={pageAnim}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="h-full flex flex-col"
            >
              <h2 className="text-4xl font-bold mb-6">Chat 💬</h2>

              <div className="flex-1 card bg-base-100 shadow-xl flex flex-col">
                {/* Messages */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  <div className="chat chat-start">
                    <div className="chat-bubble">
                      Hey 👋 Welcome to Chat Verse!
                    </div>
                  </div>

                  <div className="chat chat-end">
                    <div className="chat-bubble chat-bubble-primary">
                      Thanks! Let’s start chatting 🚀
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="border-t p-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="input input-bordered flex-1"
                  />
                  <button className="btn btn-primary">Send</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------------- PROFILE ---------------- */}
          {active === "profile" && (
            <motion.div
              key="profile"
              variants={pageAnim}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-4xl font-bold mb-8">Profile 👤</h2>
              {/* (Profile code unchanged – kept simple here) */}
            </motion.div>
          )}

          {/* ---------------- SETTINGS ---------------- */}
          {active === "settings" && (
            <motion.div
              key="settings"
              variants={pageAnim}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <h2 className="text-4xl font-bold mb-8">Settings ⚙️</h2>

              <div className="card max-w-xl bg-base-100 shadow-xl">
                <div className="card-body space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold">Notifications</h4>
                      <p className="text-sm opacity-70">
                        Enable alerts & updates
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={notifications}
                      onChange={() => setNotifications(!notifications)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
};

export default UserDashboard;
