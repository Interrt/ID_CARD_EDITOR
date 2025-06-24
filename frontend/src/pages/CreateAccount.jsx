import React, { useState } from "react";
import "./createaccount.css";
import { Link, useNavigate } from "react-router-dom";

function CreateAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
    location: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (formData.password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create account");
      }
      const userData = await response.json();
      localStorage.setItem('user', JSON.stringify(userData));
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="create-account-container">
      <div className="create-account-card">
        <h1 className="title">LET'S GET YOU STARTED</h1>
        <h2 className="subtitle">Create an Account</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              placeholder="Enter your mobile number"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              pattern="\d{10}"
              title="Mobile number should be 10 digits"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              placeholder="Enter your location"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Creating Account..." : "GET STARTED"}
          </button>
        </form>

        <div className="social-login">
          <p className="divider">or sign up with</p>
          <div className="social-buttons">
            <button type="button" className="social-button google">
              Sign up with Google
            </button>
            <button type="button" className="social-button facebook">
              Sign up with Facebook
            </button>
            <button type="button" className="social-button apple">
              Sign up with Apple
            </button>
          </div>
        </div>

        <p className="create_para">
          Already have an account? <Link to="/login">LOGIN HERE</Link>
        </p>
      </div>
    </div>
  );
}

export default CreateAccount;
