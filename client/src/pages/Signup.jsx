import React, { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";


const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Creating account...");

    try {
      const res = await axiosInstance.post("/api/user/signup", {
        name,
        email,
        phone,
        password,
      });

      toast.success(res.data.message || "Account created 🎉", {
        id: toastId,
      });

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed", {
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
              <h2 className="text-3xl font-bold">Create Account 🚀</h2>
              <p className="text-base-content/70 mt-1">
                Join Chat Verse and start chatting
              </p>
            </div>

            {/* Full Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                className="input input-bordered"
                placeholder="Lucky Pawar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered"
                placeholder="luckypawar@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Phone */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                className="input input-bordered"
                placeholder="0000000000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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
                className="input input-bordered"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="btn btn-primary w-full mt-2"
              disabled={loading}
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-base-content/60 mt-2">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary font-semibold">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
