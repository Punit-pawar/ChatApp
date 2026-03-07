import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../config/api";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearForm = () => {
    setFormData({
      fullName: "",
      email: "",
      mobileNumber: "",
      password: "",
      confirmPassword: "",
    });
    setValidationError({});
  };

  const validate = () => {
    let Error = {};

    if (formData.fullName.length < 3) {
      Error.fullName = "Name should be more than 3 characters";
    } else if (!/^[A-Za-z ]+$/.test(formData.fullName)) {
      Error.fullName = "Only alphabets and spaces allowed";
    }

    if (
      !/^[\w\.]+@(gmail|outlook|ricr|yahoo)\.(com|in|co.in)$/.test(
        formData.email
      )
    ) {
      Error.email = "Use proper email format";
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      Error.mobileNumber = "Only Indian mobile numbers allowed";
    }

    // ✅ Only password match check
    if (formData.password !== formData.confirmPassword) {
      Error.confirmPassword = "Passwords do not match";
    }

    setValidationError(Error);
    return Object.keys(Error).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validate()) {
      setIsLoading(false);
      toast.error("Fill the form correctly");
      return;
    }

    try {
      const res = await api.post("/auth/register", formData);
      toast.success(res.data.message);
      handleClearForm();
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl transform transition-all duration-500 hover:scale-[1.01]">
        {/* Glassmorphism Card */}
        <div className="card bg-base-100/90 backdrop-blur-md shadow-2xl border border-base-content/5">
          <div className="card-body p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-4xl font-extrabold bg-primary bg-clip-text text-transparent inline-block pb-1">
                Register
              </h2>
              <p className="text-base-content/70 flex items-center justify-center gap-2 mt-2 font-medium">
                Hello New User 
              </p>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              onReset={handleClearForm}
              className="space-y-4"
            >
              <div className="relative group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-primary/40 focus:border-primary group-hover:border-primary/50 bg-base-100"
                />
                {validationError.fullName && (
                  <p className="text-error text-xs font-medium mt-1 ml-1 transition-all">
                    {validationError.fullName}
                  </p>
                )}
              </div>

              <div className="relative group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-primary/40 focus:border-primary group-hover:border-primary/50 bg-base-100"
                />
                {validationError.email && (
                  <p className="text-error text-xs font-medium mt-1 ml-1 transition-all">
                    {validationError.email}
                  </p>
                )}
              </div>

              <div className="relative group">
                <input
                  type="tel"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  maxLength="10"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-primary/40 focus:border-primary group-hover:border-primary/50 bg-base-100"
                />
                {validationError.mobileNumber && (
                  <p className="text-error text-xs font-medium mt-1 ml-1 transition-all">
                    {validationError.mobileNumber}
                  </p>
                )}
              </div>

              <div className="relative group">
                <input
                  type="password"
                  name="password"
                  placeholder="Create Password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-primary/40 focus:border-primary group-hover:border-primary/50 bg-base-100"
                />
              </div>

              <div className="relative group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="input input-bordered w-full transition-all duration-300 focus:ring-2 focus:ring-primary/40 focus:border-primary group-hover:border-primary/50 bg-base-100"
                />
                {validationError.confirmPassword && (
                  <p className="text-error text-xs font-medium mt-1 ml-1 transition-all">
                    {validationError.confirmPassword}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="reset"
                  disabled={isLoading}
                  className="btn btn-outline flex-1 transition-all duration-300 hover:bg-base-200 hover:-translate-y-1 hover:shadow-md"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn border-none bg-primary text-white flex-1 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                >
                  {isLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-base-content/60 mt-8 transition-opacity hover:opacity-100 opacity-70">
          We respect your privacy 🔒
        </p>
      </div>
    </div>
  );
};

export default Register;