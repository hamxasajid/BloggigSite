import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCamera,
} from "react-icons/fa";

const CompleteProfile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    about: "",
    education: "",
    role: "user",
    profilePicture: "",
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://bloggigsite-production.up.railway.app/api/users/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUserData({
          name: response.data.name || response.data.username,
          email: response.data.email,
          phone: response.data.phone || "",
          about: response.data.about || "",
          education: response.data.education || "",
          role: response.data.role || "user",
          profilePicture: response.data.profilePicture || "",
        });
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "bloggig_profile"); // Replace with your Cloudinary upload preset

    try {
      setUploading(true);
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", // Replace with your Cloudinary cloud name
        formData
      );

      setUserData((prev) => ({
        ...prev,
        profilePicture: response.data.secure_url,
      }));
      setSuccess("Profile picture uploaded successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError("Failed to upload profile picture");
      setTimeout(() => setError(""), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "https://bloggigsite-production.up.railway.app/api/users/profile",
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local storage with new user data
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        ...userData,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccess("Profile updated successfully!");
      setTimeout(() => {
        setSuccess("");
        navigate("/userdashboard");
      }, 2000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
      setTimeout(() => setError(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 min-vh-100" style={{ maxWidth: "800px" }}>
      <div className="row justify-content-center">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Complete Your Profile</h3>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* Profile Picture */}
                  <div className="col-md-4 mb-4 text-center">
                    <div className="position-relative">
                      {userData.profilePicture ? (
                        <img
                          src={userData.profilePicture}
                          alt="Profile"
                          className="rounded-circle mb-3"
                          style={{
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          className="d-flex align-items-center justify-content-center rounded-circle bg-secondary text-white mb-3 mx-auto"
                          style={{ width: "150px", height: "150px" }}
                        >
                          <FaUser size={60} />
                        </div>
                      )}
                      <label className="btn btn-sm btn-outline-primary position-absolute bottom-0 start-50 translate-middle-x">
                        <FaCamera className="me-1" />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="d-none"
                          disabled={uploading}
                        />
                      </label>
                    </div>
                    {uploading && (
                      <div className="text-center mt-2">
                        <small className="text-muted">Uploading...</small>
                      </div>
                    )}
                  </div>

                  {/* Profile Details */}
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        <FaUser className="me-2" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        <FaEnvelope className="me-2" />
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                        disabled
                      />
                      <small className="text-muted">
                        Contact admin to change email
                      </small>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">
                        <FaPhone className="me-2" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                        pattern="[0-9]{10}"
                        title="10 digit phone number"
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="about" className="form-label">
                        About You
                      </label>
                      <textarea
                        className="form-control"
                        id="about"
                        name="about"
                        rows="3"
                        value={userData.about}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="education" className="form-label">
                        <FaGraduationCap className="me-2" />
                        Education
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="education"
                        name="education"
                        value={userData.education}
                        onChange={handleInputChange}
                        placeholder="e.g., BSc Computer Science"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="role" className="form-label">
                        Account Type
                      </label>
                      <select
                        className="form-select"
                        id="role"
                        name="role"
                        value={userData.role}
                        onChange={handleInputChange}
                      >
                        <option value="user">Regular User</option>
                        <option value="author">
                          Author (Can publish blogs)
                        </option>
                      </select>
                    </div>

                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                      <button
                        type="button"
                        className="btn btn-outline-secondary me-md-2"
                        onClick={() => navigate("/userdashboard")}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Profile
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
