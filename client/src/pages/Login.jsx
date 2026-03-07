import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/api";
import { useNavigate } from "react-router-dom";
import { useGoogleAuth } from "../config/GoogleAuth";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();

  const { isLoading, error, isInitialized, signInWithGoogle } = useGoogleAuth();

  const handleGoogleSuccess = async (userData) => {
    console.log("Google Login Data", userData);
    setLoading(true);
    try {
      const res = await api.post("/auth/googleLogin", userData);

      toast.success(res.data.message);

      // optional: store user or token
      sessionStorage.setItem("AppUser", JSON.stringify(res.data.data));

      handleClearForm();

      // simple redirect
      navigate("/chatting");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const GoogleLogin = () => {
    signInWithGoogle(handleGoogleSuccess, handleGoogleFailure);
  };

  const handleGoogleFailure = (error) => {
    console.error("Google login failed:", error);
    toast.error("Google login failed. Please try again.");
  };

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [Loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setFormData({ email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", formData);

      toast.success(res.data.message);

      // optional: store user or token
      sessionStorage.setItem("AppUser", JSON.stringify(res.data.data));

      handleClearForm();

      // simple redirect
      navigate("/chatting");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md transform transition-all duration-500 hover:scale-[1.01]">
        {/* Glassmorphism Card */}
        <div className="card bg-base-100/90 backdrop-blur-md shadow-2xl border border-base-content/5">
          <div className="card-body p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-4xl font-extrabold bg-primary bg-clip-text text-transparent inline-block pb-1">
                Welcome Back
              </h2>
              <p className="text-base-content/70 flex items-center justify-center gap-2 mt-2 font-medium">
                We're glad to see you again 
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              onReset={handleClearForm}
              className="space-y-5"
            >
              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={Loading}
                  required
                  className="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-primary/40 focus:border-primary group-hover:border-primary/50 bg-base-100"
                />
              </div>

              <div className="relative group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={Loading}
                  required
                  className="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-primary/40 focus:border-primary group-hover:border-primary/50 bg-base-100"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="reset"
                  disabled={Loading}
                  className="btn btn-outline flex-1 transition-all duration-300 hover:bg-base-200 hover:-translate-y-1 hover:shadow-md"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={Loading}
                  className="btn border-none bg-primary text-white flex-1 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                >
                  {Loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Login"
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="divider text-xs text-base-content/40 my-6 font-semibold tracking-widest uppercase">
              Or continue with
            </div>

            {/* Google Login button */}
            <div>
              {error ? (
                <button
                  className="btn btn-outline btn-error font-sans flex items-center justify-center gap-3 w-full opacity-80"
                  disabled
                >
                  <FcGoogle className="text-2xl" />
                  {error}
                </button>
              ) : (
                <button
                  onClick={GoogleLogin}
                  className="btn btn-outline bg-base-100 hover:bg-base-200 font-sans flex items-center justify-center gap-3 w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  disabled={!isInitialized || isLoading}
                >
                  <FcGoogle className="text-2xl" />
                  {isLoading ? (
                    <span className="loading loading-dots loading-sm"></span>
                  ) : isInitialized ? (
                    "Google"
                  ) : (
                    "Google Auth Error"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-base-content/60 mt-8 transition-opacity hover:opacity-100 opacity-70">
          Your data is safe with us 🔐
        </p>
      </div>
    </div>
  );
};

export default Login;