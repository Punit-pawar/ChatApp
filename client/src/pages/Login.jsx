import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useGoogleAuth } from "../config/GoogleAuth";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Google Auth Hook
  const {
    isLoading: googleLoading,
    error: googleError,
    isInitialized,
    signInWithGoogle,
  } = useGoogleAuth();

  const handleGoogleFailure = (error) => {
    console.error("Google login failed:", error);
    toast.error("Google login failed. Please try again.");
  };

  const handleGoogleSuccess = async (userData) => {
    try {
      const toastId = toast.loading("Logging in with Google...");

      const res = await axios.post(
        "http://localhost:4500/api/user/google-login",
        userData
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Logged in with Google", { id: toastId });
      navigate("/dashboard");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Google login server error"
      );
    }
  };

  const GoogleLogin = () => {
    signInWithGoogle(handleGoogleSuccess, handleGoogleFailure);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Logging in...");

    try {
      const res = await axios.post(
        "http://localhost:4500/api/user/login",
        { email, password }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(res.data.message || "Login successful", {
        id: toastId,
      });

      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Server error", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="card bg-base-100 shadow-2xl border border-base-300"
        >
          <div className="card-body gap-4">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-3xl font-bold">
                Chat Verse 💬
              </h1>
              <p className="text-base-content/70 mt-1">
                Welcome back, let’s continue
              </p>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Luckypawar@gmail.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Divider */}
            <div className="divider">OR</div>

            {/* Google Login */}
            {googleError ? (
              <button
                type="button"
                className="btn btn-outline btn-error w-full flex gap-2"
                disabled
              >
                <FcGoogle className="text-xl" />
                {googleError}
              </button>
            ) : (
              <button
                type="button"
                onClick={GoogleLogin}
                className="btn btn-outline w-full flex gap-2"
                disabled={!isInitialized || googleLoading}
              >
                <FcGoogle className="text-xl" />
                {googleLoading
                  ? "Loading..."
                  : isInitialized
                  ? "Continue with Google"
                  : "Google Auth Error"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
