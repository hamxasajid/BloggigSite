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
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [justSubmittedRoleRequest, setJustSubmittedRoleRequest] =
    useState(false);

  const navigate = useNavigate();
  const url = "https://bloggigsite-production.up.railway.app";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${url}/api/users/me`, {
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
        });

        setJustSubmittedRoleRequest(role === "Pending");

        // Show a one-time "Author approved" success message
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
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
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
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                <div className="row">
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
                        <FaSpinner className="fa-spin me-2" />
                        <small className="text-muted">Uploading...</small>
                      </div>
                    )}
                  </div>

                  <div className="col-md-8">
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        <FaUser className="me-2" />
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
                        disabled
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label">
                        <FaPhone className="me-2" />
                        Phone
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={userData.phone}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="about" className="form-label">
                        <FaGraduationCap className="me-2" />
                        About You
                      </label>
                      <textarea
                        className="form-control"
                        id="about"
                        name="about"
                        rows="4"
                        value={userData.about}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="education" className="form-label">
                        Education
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="education"
                        name="education"
                        value={userData.education}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="role" className="form-label">
                        Role
                      </label>
                      <select
                        className="form-control"
                        id="role"
                        name="role"
                        value={userData.role}
                        onChange={handleInputChange}
                        disabled={
                          userData.role === "Pending" ||
                          userData.role === "author"
                        }
                      >
                        <option value="user">User</option>
                        <option value="Pending">Author</option>
                      </select>

                      {justSubmittedRoleRequest &&
                        userData.role === "Pending" && (
                          <div className="alert alert-warning mt-2">
                            <FaClock className="me-2" />
                            Your request to become an Author is pending
                            approval.
                          </div>
                        )}
                    </div>

                    <div className="mb-3">
                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={uploading}
                      >
                        Update Profile
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
