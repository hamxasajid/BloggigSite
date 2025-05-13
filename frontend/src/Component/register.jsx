import React, { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import axios from "axios";
import "./register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const url = "https://bloggigsite-production.up.railway.app";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    const { username, email, password, confirmPassword, role } = formData;

    // Basic validations
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      let responseMailboxLayer;
      let responseAbstract;

      // Try MailboxLayer API first
      try {
        const apiKeyMailboxLayer = "4aa8f4faef998a46752ed3da9586297d";
        responseMailboxLayer = await axios.get(
          `http://apilayer.net/api/check?access_key=${apiKeyMailboxLayer}&email=${email}`
        );
      } catch {
        console.error("MailboxLayer API failed, trying Abstract API...");
        // If MailboxLayer fails, use Abstract API
        const apiKeyAbstract = "653addd6f05740c49a2e19436ad0c659";
        responseAbstract = await axios.get(
          `https://emailreputation.abstractapi.com/v1/?api_key=${apiKeyAbstract}&email=${email}`
        );
      }

      // Check for response from MailboxLayer if it was successful
      if (responseMailboxLayer) {
        const dataMailboxLayer = responseMailboxLayer.data;
        if (
          !dataMailboxLayer.smtp_check ||
          dataMailboxLayer.disposable ||
          dataMailboxLayer.score < 0.5
        ) {
          setMessage(
            "Please provide a valid, non-temporary email address to proceed with the registration."
          );
          setLoading(false);
          return;
        }
      }

      // Check for response from Abstract API if it was used
      if (responseAbstract) {
        const dataAbstract = responseAbstract.data;
        if (
          dataAbstract.email_deliverability.status !== "deliverable" ||
          dataAbstract.email_quality.is_disposable ||
          dataAbstract.email_quality.score < 0.7
        ) {
          setMessage(
            "Please provide a valid, non-temporary email address to proceed with the registration."
          );
          setLoading(false);
          return;
        }
      }

      // Proceed with registration if email is valid
      const registrationResponse = await fetch(`${url}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const registrationData = await registrationResponse.json();

      if (!registrationResponse.ok)
        throw new Error(registrationData.message || "Registration failed");

      // Send verification email
      const verificationLink = `${url}/api/verify-email?token=${registrationData.verificationToken}`;
      await emailjs.send(
        "service_z3hby28",
        "template_mbeauia",
        {
          username,
          email,
          verification_link: verificationLink,
        },
        "ypG_93Enakfn2cUf4" // Replace with your public key
      );

      setMessage(
        "Registration successful! Please check your email to verify your account."
      );

      // Reset form data
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container d-flex align-items-center justify-content-center py-5 min-vh-100 bg-light">
      <div
        className="card shadow-sm border-0"
        style={{ width: "100%", maxWidth: "450px" }}
      >
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold text-primary">Create Account</h2>
            <p className="text-muted">Join our community today</p>
          </div>

          {message && (
            <div
              className={`alert ${
                message.toLowerCase().includes("success")
                  ? "alert-success"
                  : "alert-danger"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control py-2"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control py-2"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-control py-2"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="At least 8 characters"
              />
              <div className="form-text">Must be at least 8 characters</div>
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control py-2"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Re-enter your password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Registering...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="small text-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none fw-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
