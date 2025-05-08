import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserDash = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetching user data from localStorage (or from an API if needed)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      navigate("/login"); // Redirect to login if no user data found
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 min-vh-100" style={{ maxWidth: "900px" }}>
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header text-center">
              <h3>Welcome to Your Dashboard</h3>
            </div>
            <div className="card-body">
              {userData ? (
                <>
                  {/* User info */}
                  <div className="row mb-3">
                    <div className="col-md-6 d-flex align-items-center">
                      {/* Avatar showing user's first name letter */}
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          borderRadius: "50%",
                          backgroundColor: "#ccc",
                          marginRight: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "bold",
                          fontSize: "18px",
                          color: "#fff",
                        }}
                      >
                        {userData.username.charAt(0).toUpperCase()}
                      </div>
                      <h4>{userData.username}</h4>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <p className="badge bg-primary">{userData.role}</p>
                    </div>
                  </div>

                  {/* User Actions */}
                  <div className="row mb-4">
                    <div className="col-12 col-md-6 mb-3">
                      <div className="card shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title">Your Blog Posts</h5>
                          <p className="card-text">
                            View, edit, or manage your recent blog posts.
                          </p>
                          <a
                            href="/Userdashboard/viewallblogs"
                            className="btn btn-primary w-100"
                          >
                            View My Blogs
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-6 mb-3">
                      <div className="card shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title">Create New Blog</h5>
                          <p className="card-text">
                            Start a new blog post and share your thoughts.
                          </p>
                          <a
                            href="/Userdashboard/createblog"
                            className="btn btn-success w-100"
                          >
                            Create New Blog
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p>No user data found. Please log in.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDash;
