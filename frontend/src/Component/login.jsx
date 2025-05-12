import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import emailjs from "@emailjs/browser";
import { AuthContext } from "../Context/AuthCon";
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const backendUrl = "https://bloggigsite-production.up.railway.app";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendVerificationEmail = async (email, username, token) => {
    try {
      const verificationLink = `${backendUrl}/api/verify-email?token=${token}`;

      await emailjs.send(
        "service_z3hby28",
        "template_mbeauia",
        {
          email,
          username,
          verification_link: verificationLink,
        },
        "ypG_93Enakfn2cUf4"
      );

      return true;
    } catch (err) {
      console.error("Email sending error:", err);
      return false;
    }
  };

  const handleResendVerification = async (email) => {
    try {
      const response = await fetch(`${backendUrl}/api/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      const emailSent = await sendVerificationEmail(
        data.email,
        data.username,
        data.verificationToken
      );

      if (!emailSent) {
        throw new Error("Failed to send verification email");
      }

      await Swal.fire({
        title: "Email Sent!",
        text: "Verification email has been resent. Please check your inbox.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: "#1c45c1",
      });
    } catch (err) {
      await Swal.fire({
        title: "Error",
        text: err.message || "Failed to resend verification email",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#1c45c1",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${backendUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message === "Email not verified") {
          const { value: resend } = await Swal.fire({
            title: "Email Not Verified",
            html: `
              <p>Please verify your email before logging in.</p>
              <p>Didn't receive the verification email?</p>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Resend Verification",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#1c45c1",
          });

          if (resend) {
            await handleResendVerification(formData.email);
          }
          return;
        }
        throw new Error(data.message);
      }

      // Store token and user data
      localStorage.setItem("token", data.token);
      login({
        username: data.username,
        email: data.email,
        role: data.role,
      });

      setMessage("Login successful!");
      navigate(data.role === "admin" ? "/admin" : "/userdashboard");
    } catch (err) {
      setMessage(err.message || "Login failed");
      await Swal.fire({
        title: "Error",
        text: err.message || "Login failed",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#1c45c1",
      });
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
            <h2 className="fw-bold text-primary">Welcome Back</h2>
            <p className="text-muted">Sign in to your account</p>
          </div>

          {message && (
            <div
              className={`alert ${
                message.includes("successful")
                  ? "alert-success"
                  : "alert-danger"
              } mb-4`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control py-2"
                id="email"
                name="email"
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
                className="form-control py-2"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
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
                    aria-hidden="true"
                  ></span>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="small text-muted">
              Don't have an account?{" "}
              <Link to="/signup" className="text-decoration-none fw-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
