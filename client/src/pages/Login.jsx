import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      
      <div className="w-full max-w-md card bg-base-100 shadow-xl border border-base-300">
        <div className="card-body">

          {/* App Title */}
          <h1 className="text-3xl font-bold text-center text-base-content">
            Chat Verse 💬
          </h1>
          <p className="text-center text-base-content/70 mb-4">
            Login to continue chatting
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            {/* Login Button */}
            <button type="submit" className="btn btn-primary w-full mt-4">
              Login
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-base-content/70 mt-4">
            Don’t have an account?{" "}
            <span className="font-semibold cursor-pointer hover:underline">
              Sign up
            </span>
            
          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;
