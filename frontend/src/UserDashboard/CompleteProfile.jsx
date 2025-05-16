import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaCamera,
  FaSpinner,
  FaClock,
  FaFacebook,
  FaLinkedin,
  FaGithub,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa";

const CompleteProfile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phone: "",
    about: "",
    education: "",
    role: "user",
    profilePicture: "",
    socialLinks: {
      facebook: "",
      linkedin: "",
      github: "",
      instagram: "",
      portfolio: "",
    },
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [justSubmittedRoleRequest, setJustSubmittedRoleRequest] =
    useState(false);
  const [activeSection, setActiveSection] = useState("basic");

  const navigate = useNavigate();
  const url = "https://bloggigsite-production.up.railway.app";
  // const url = "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${url}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const role = response.data.role || "user";

        setUserData({
          username: response.data.username || "",
          email: response.data.email,
          phone: response.data.phone || "",
          about: response.data.about || "",
          education: response.data.education || "",
          role,
          profilePicture: response.data.profilePicture || "",
          socialLinks: response.data.socialLinks || {
            facebook: "",
            linkedin: "",
            github: "",
            instagram: "",
            portfolio: "",
          },
        });

        setJustSubmittedRoleRequest(role === "Pending");

        if (
          role === "author" &&
          !localStorage.getItem("authorApprovedMsgShown")
        ) {
          setSuccess("Your Author request was approved!");
          localStorage.setItem("authorApprovedMsgShown", "true");
        }
      } catch {
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

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "my_upload_preset");

    try {
      setUploading(true);
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dr46wo7mq/image/upload",
        formData
      );

      setUserData((prev) => ({
        ...prev,
        profilePicture: response.data.secure_url,
      }));
      setSuccess("Profile picture uploaded successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
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
      const dataToSend = { ...userData };

      const isRequestingAuthor = dataToSend.role === "Pending";

      const response = await axios.put(`${url}/profile`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user")),
        ...response.data,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      if (isRequestingAuthor) {
        setSuccess(
          "Author request submitted! Your role will be updated after approval."
        );
        setJustSubmittedRoleRequest(true);
      } else {
        setSuccess("Profile updated successfully!");
        setJustSubmittedRoleRequest(false);
      }

      setTimeout(() => setSuccess(""), 3000);

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
      setTimeout(() => setError(""), 3000);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
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
    <div className="container py-4 min-vh-100">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10">
          <div className="card shadow-sm border-0 overflow-hidden">
            <div className="card-header bg-gradient-primary text-white py-4">
              <div className="d-flex flex-column flex-md-row align-items-center justify-content-between">
                <h2 className="mb-3 mb-md-0">Complete Your Profile</h2>
                <div className="d-flex">
                  <button
                    className={`btn btn-sm mx-1 ${
                      activeSection === "basic"
                        ? "btn-light"
                        : "btn-outline-light"
                    }`}
                    onClick={() => scrollToSection("basic")}
                  >
                    Basic Info
                  </button>
                  <button
                    className={`btn btn-sm mx-1 ${
                      activeSection === "social"
                        ? "btn-light"
                        : "btn-outline-light"
                    }`}
                    onClick={() => scrollToSection("social")}
                  >
                    Social Links
                  </button>
                  <button
                    className={`btn btn-sm mx-1 ${
                      activeSection === "about"
                        ? "btn-light"
                        : "btn-outline-light"
                    }`}
                    onClick={() => scrollToSection("about")}
                  >
                    About
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                  {error}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setError("")}
                  ></button>
                </div>
              )}
              {success && (
                <div className="alert alert-success alert-dismissible fade show">
                  {success}
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSuccess("")}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Basic Info Section */}
                <div id="basic" className="mb-5">
                  <h4 className="mb-4 border-bottom pb-2 text-primary">
                    Basic Information
                  </h4>
                  <div className="row">
                    <div className="col-md-4 mb-4 text-center">
                      <div className="position-relative mb-3">
                        {userData.profilePicture ? (
                          <img
                            src={userData.profilePicture}
                            alt="Profile"
                            className="rounded-circle shadow"
                            style={{
                              width: "150px",
                              height: "150px",
                              objectFit: "cover",
                              border: "3px solid #f8f9fa",
                            }}
                          />
                        ) : (
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle bg-light text-secondary shadow mb-3 mx-auto"
                            style={{ width: "150px", height: "150px" }}
                          >
                            <FaUser size={60} />
                          </div>
                        )}
                        <label className="btn btn-sm btn-primary position-absolute bottom-0 start-50 translate-middle-x shadow-sm">
                          <FaCamera className="me-1" />
                          {userData.profilePicture ? "Change" : "Upload"}
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
                          <FaSpinner className="fa-spin me-2 text-primary" />
                          <small className="text-muted">Uploading...</small>
                        </div>
                      )}
                    </div>

                    <div className="col-md-8">
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label
                            htmlFor="username"
                            className="form-label fw-bold"
                          >
                            <FaUser className="me-2 text-muted" />
                            Username
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={userData.username}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label htmlFor="email" className="form-label fw-bold">
                            <FaEnvelope className="me-2 text-muted" />
                            Email
                          </label>
                          <input
                            type="email"
                            className="form-control bg-light"
                            id="email"
                            name="email"
                            value={userData.email}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="phone" className="form-label fw-bold">
                            <FaPhone className="me-2 text-muted" />
                            Phone
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="phone"
                            name="phone"
                            value={userData.phone}
                            onChange={handleInputChange}
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label
                            htmlFor="education"
                            className="form-label fw-bold"
                          >
                            <FaGraduationCap className="me-2 text-muted" />
                            Education
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="education"
                            name="education"
                            value={userData.education}
                            onChange={handleInputChange}
                            placeholder="Your degree or institution"
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="role" className="form-label fw-bold">
                          Account Type
                        </label>
                        <select
                          className="form-select"
                          id="role"
                          name="role"
                          value={userData.role}
                          onChange={handleInputChange}
                          disabled={
                            userData.role === "Pending" ||
                            userData.role === "author"
                          }
                        >
                          <option value="user">Standard User</option>
                          <option value="Pending">Request Author Status</option>
                        </select>

                        {justSubmittedRoleRequest &&
                          userData.role === "Pending" && (
                            <div className="alert alert-warning mt-3">
                              <FaClock className="me-2" />
                              Your request to become an Author is pending
                              approval.
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Links Section */}
                <div id="social" className="mb-5">
                  <h4 className="mb-4 border-bottom pb-2 text-primary">
                    Social Links
                  </h4>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="facebook" className="form-label fw-bold">
                        <FaFacebook className="me-2 text-primary" />
                        Facebook
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="facebook"
                        name="facebook"
                        value={userData.socialLinks.facebook}
                        onChange={handleSocialLinkChange}
                        placeholder="https://facebook.com/yourusername"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="linkedin" className="form-label fw-bold">
                        <FaLinkedin className="me-2 text-primary" />
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="linkedin"
                        name="linkedin"
                        value={userData.socialLinks.linkedin}
                        onChange={handleSocialLinkChange}
                        placeholder="https://linkedin.com/in/yourusername"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="github" className="form-label fw-bold">
                        <FaGithub className="me-2" />
                        GitHub
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="github"
                        name="github"
                        value={userData.socialLinks.github}
                        onChange={handleSocialLinkChange}
                        placeholder="https://github.com/yourusername"
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="instagram" className="form-label fw-bold">
                        <FaInstagram className="me-2 text-danger" />
                        Instagram
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="instagram"
                        name="instagram"
                        value={userData.socialLinks.instagram}
                        onChange={handleSocialLinkChange}
                        placeholder="https://instagram.com/yourusername"
                      />
                    </div>

                    <div className="col-12 mb-3">
                      <label htmlFor="portfolio" className="form-label fw-bold">
                        <FaGlobe className="me-2 text-info" />
                        Portfolio Website
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        id="portfolio"
                        name="portfolio"
                        value={userData.socialLinks.portfolio}
                        onChange={handleSocialLinkChange}
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </div>
                </div>

                {/* About Section */}
                <div id="about" className="mb-4">
                  <h4 className="mb-4 border-bottom pb-2 text-primary">
                    About You
                  </h4>
                  <div className="mb-3">
                    <label htmlFor="about" className="form-label fw-bold">
                      Tell us about yourself
                    </label>
                    <textarea
                      className="form-control"
                      id="about"
                      name="about"
                      rows="6"
                      value={userData.about}
                      onChange={handleInputChange}
                      placeholder="Share your background, interests, and what you're passionate about..."
                    ></textarea>
                    <div className="form-text">
                      This will be displayed on your public profile.
                    </div>
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <FaSpinner className="fa-spin me-2" />
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
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
