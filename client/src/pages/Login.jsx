import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Logging in...");

    try {
      const res = await axios.post(
        "http://localhost:4500/api/user/login", // ✅ FIXED
        { email, password }
      );

      toast.success(res.data.message || "Login successful", {
        id: toastId,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");

    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Server error",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <form onSubmit={handleSubmit} className="card bg-base-100 p-6 w-96">
        <h1 className="text-2xl font-bold text-center">Chat Verse 💬</h1>

        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full mt-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full mt-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="btn btn-primary w-full mt-4"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
