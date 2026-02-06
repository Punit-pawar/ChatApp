import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Creating account...");

    try {
      const res = await axios.post(
        "http://localhost:4500/api/user/signup",
        {
          name,
          email,
          phone,
          password,
        }
      );

      toast.success(res.data.message || "Account created 🎉", {
        id: toastId,
      });

      // optional: auto redirect to login
      navigate("/login");

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");

    } catch (error) {
      console.error("SIGNUP ERROR 👉", error);

      toast.error(
        error?.response?.data?.message || "Signup failed",
        { id: toastId }
      );
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

            <div className="text-center">
              <h2 className="text-3xl font-bold">Create Account 🚀</h2>
              <p className="text-base-content/70">
                Join Chat Verse and start chatting
              </p>
            </div>

            <input
              className="input input-bordered"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <input
              type="email"
              className="input input-bordered"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              className="input input-bordered"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />

            <input
              type="password"
              className="input input-bordered"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>

            <p className="text-center text-sm opacity-70">
              Already have an account?{" "}
              <Link to="/login" className="link link-primary">
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
