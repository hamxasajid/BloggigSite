import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserEdit, FaBlog, FaPlusSquare, FaUserCircle } from "react-icons/fa";

const UserDash = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserData(user);
      // Check if profile is complete (has at least name and email)
      setProfileComplete(user?.name && user?.email);
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

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
    <div className="container py-5 min-vh-100" style={{ maxWidth: "900px" }}>
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Welcome to Your Dashboard</h3>
            </div>
            <div className="card-body">
              {userData ? (
                <>
                  {/* User Profile Summary */}
                  <div className="row mb-4 align-items-center">
                    <div className="col-md-8 d-flex align-items-center">
                      <div className="me-3">
                        {userData.profilePicture ? (
                          <img
                            src={userData.profilePicture}
                            alt="Profile"
                            className="rounded-circle"
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle bg-secondary text-white"
                            style={{ width: "80px", height: "80px" }}
                          >
                            <FaUserCircle size={40} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="mb-1">
                          {userData.name || userData.username}
                          {userData.role === "author" && (
                            <span className="badge bg-success ms-2">
                              Author
                            </span>
                          )}
                        </h4>
                        <p className="text-muted mb-1">{userData.email}</p>
                        {!profileComplete && (
                          <div className="alert alert-warning p-2 mb-0 mt-2">
                            <small>
                              Your profile is incomplete. Please complete your
                              profile to access all features.
                            </small>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-4 text-md-end mt-3 mt-md-0">
                      <button
                        onClick={() =>
                          navigate("/userdashboard/complete-profile")
                        }
                        className="btn btn-outline-primary"
                      >
                        <FaUserEdit className="me-2" />
                        {profileComplete ? "Edit Profile" : "Complete Profile"}
                      </button>
                    </div>
                  </div>

                  {/* Dashboard Stats */}
                  <div className="row mb-4">
                    <div className="col-md-4 mb-3">
                      <div className="card border-0 bg-light">
                        <div className="card-body text-center">
                          <h5 className="card-title">Blog Posts</h5>
                          <p className="display-6 mb-0">12</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card border-0 bg-light">
                        <div className="card-body text-center">
                          <h5 className="card-title">Followers</h5>
                          <p className="display-6 mb-0">256</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card border-0 bg-light">
                        <div className="card-body text-center">
                          <h5 className="card-title">Following</h5>
                          <p className="display-6 mb-0">34</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                              <FaBlog className="text-primary" size={24} />
                            </div>
                            <h5 className="mb-0">Manage Blogs</h5>
                          </div>
                          <p className="card-text">
                            View, edit, or manage your recent blog posts.
                          </p>
                          <button
                            onClick={() =>
                              navigate("/Userdashboard/viewallblogs")
                            }
                            className="btn btn-primary mt-auto align-self-start"
                          >
                            Go to My Blogs
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                          <div className="d-flex align-items-center mb-3">
                            <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                              <FaPlusSquare
                                className="text-success"
                                size={24}
                              />
                            </div>
                            <h5 className="mb-0">Create Blog</h5>
                          </div>
                          <p className="card-text">
                            Start a new blog post and share your thoughts with
                            the world.
                          </p>
                          <button
                            onClick={() =>
                              navigate("/Userdashboard/createblog")
                            }
                            className="btn btn-success mt-auto align-self-start"
                          >
                            Create New Blog
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="alert alert-danger">
                  No user data found. Please log in.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDash;
