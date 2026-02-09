import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { FiMenu } from "react-icons/fi";

/* ================= CLOUDINARY CONFIG ================= */
const CLOUD_NAME = "YOUR_CLOUD_NAME"; // 👈 change
const UPLOAD_PRESET = "chatverse_profile"; // 👈 unsigned preset

/* ================= ANIMATIONS ================= */
const pageAnim = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20 },
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("profile");
  const [collapsed, setCollapsed] = useState(false);

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

  /* ================= IMAGE UPLOAD ================= */
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Uploading photo...");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (!data.secure_url) throw new Error("Upload failed");

      const updatedUser = { ...user, avatar: data.secure_url };

      setUser(updatedUser); // 🔥 re-render
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile photo updated", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed", { id: toastId });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen from-base-200 to-base-300 flex">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } transition-all duration-300 bg-base-100/90 backdrop-blur border-r border-base-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          {!collapsed && (
            <h1 className="text-xl font-extrabold">Chat Verse 💬</h1>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn btn-ghost btn-sm"
          >
            <FiMenu size={20} />
          </button>
        </div>

        <ul className="menu p-4 gap-2 flex-1">
          <li>
            <button
              onClick={() => setActive("profile")}
              className={`${
                active === "profile" ? "text-primary font-semibold" : ""
              }`}
            >
              👤 {!collapsed && "Profile"}
            </button>
          </li>

          <li>
            <button
              onClick={() => setActive("chat")}
              className={`${
                active === "chat" ? "text-primary font-semibold" : ""
              }`}
            >
              💬 {!collapsed && "Chat"}
            </button>
          </li>
        </ul>

        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="btn btn-error btn-outline w-full"
          >
            {!collapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8 overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ================= PROFILE ================= */}
          {active === "profile" && (
            <motion.div
              key="profile"
              variants={pageAnim}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="max-w-5xl"
            >
              <h2 className="text-4xl font-bold mb-10">Profile 👤</h2>

              <div className="grid md:grid-cols-3 gap-8">
                {/* AVATAR CARD */}
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  className="card bg-base-100 shadow-2xl text-center p-8 relative overflow-hidden"
                >
                  <div className="absolute inset-0  from-primary/20 to-secondary/20 blur-2xl"></div>

                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: "easeInOut",
                    }}
                    className="relative mx-auto w-36 h-36 mb-4"
                  >
                    <img
                      src={
                        user.avatar
                          ? `${user.avatar}?t=${Date.now()}`
                          : `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`
                      }
                      alt="avatar"
                      className="rounded-full w-36 h-36 object-cover border-4 border-primary bg-base-100"
                    />

                    {/* Upload Button */}
                    <label className="absolute bottom-0 right-0 btn btn-primary btn-circle btn-sm cursor-pointer">
                      📷
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </motion.div>

                  <h3 className="text-2xl font-bold">{user.name}</h3>
                  <p className="opacity-70 text-sm">{user.email}</p>

                  <span className="badge badge-success badge-outline mt-4">
                    ● Active
                  </span>
                </motion.div>

                {/* INFO CARD */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="md:col-span-2 card bg-base-100 shadow-2xl"
                >
                  <div className="card-body space-y-8">
                    <h3 className="text-2xl font-semibold">
                      Personal Information
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        defaultValue={user.name}
                        className="input input-bordered"
                        placeholder="Full Name"
                      />
                      <input
                        type="text"
                        defaultValue={user.phone || ""}
                        placeholder="Phone"
                        className="input input-bordered"
                      />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="input input-bordered opacity-70 cursor-not-allowed md:col-span-2"
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <button className="btn btn-outline">Cancel</button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary"
                      >
                        Save Changes
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ================= CHAT ================= */}
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
                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  <div className="chat chat-start">
                    <div className="chat-bubble">
                      Welcome to Chat Verse 👋
                    </div>
                  </div>
                </div>

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
        </AnimatePresence>
      </main>
    </div>
  );
};

export default UserDashboard;
