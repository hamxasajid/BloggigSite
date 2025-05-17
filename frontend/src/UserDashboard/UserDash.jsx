import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDash.css";
import {
  FaUserEdit,
  FaBlog,
  FaPlusSquare,
  FaUserCircle,
  FaHeart,
  FaSpinner,
  FaComments,
  FaPenAlt,
  FaChartBar,
} from "react-icons/fa";
import axios from "axios";

const UserDash = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    posts: 0,
    likes: 0,
    comments: 0,
  });
  const navigate = useNavigate();
  const url = "https://bloggigsite-production.up.railway.app";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const [userResponse, blogsResponse] = await Promise.all([
          axios.get(`${url}/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${url}/api/user/blogs`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const user = {
          username: userResponse.data.username || "",
          email: userResponse.data.email,
          phone: userResponse.data.phone || "",
          about: userResponse.data.about || "",
          education: userResponse.data.education || "",
          role: userResponse.data.role || "user",
          profilePicture: userResponse.data.profilePicture || "",
          socialLinks: userResponse.data.socialLinks || {
            facebook: "",
            linkedin: "",
            github: "",
            instagram: "",
            portfolio: "",
          },
        };

        setUserData(user);
        localStorage.setItem("user", JSON.stringify(user));

        const isProfileComplete =
          user.username &&
          user.email &&
          user.phone &&
          user.about &&
          user.education;
        setProfileComplete(isProfileComplete);

        const blogs = blogsResponse.data.blogs || [];
        const totalLikes = blogs.reduce(
          (sum, blog) => sum + (blog.likes || 0),
          0
        );

        const commentRes = await axios.get(`${url}/api/comments`);
        const userBlogIds = blogs.map((blog) => blog._id);
        const commentCount = commentRes.data.comments.filter((comment) =>
          userBlogIds.includes(comment.blogId)
        ).length;

        setStats({
          posts: blogs.length,
          likes: totalLikes,
          comments: commentCount,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load user data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <FaSpinner className="fa-spin fs-3 text-primary" />
          <p className="mt-2 text-muted">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div
          className="card shadow-sm border-0 w-100 mx-3"
          style={{ maxWidth: "400px" }}
        >
          <div className="card-body text-center">
            <h5 className="text-danger mb-3">Dashboard Error</h5>
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Refresh Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4">
        {/* Header Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <div className="d-flex flex-column flex-md-row align-items-center text-center text-md-start">
                  <div className="mb-3 mb-md-0 me-md-4 position-relative">
                    {userData.profilePicture ? (
                      <img
                        src={userData.profilePicture}
                        alt="Profile"
                        className="rounded-circle shadow"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle bg-light text-primary shadow"
                        style={{ width: "100px", height: "100px" }}
                      >
                        <FaUserCircle size={48} />
                      </div>
                    )}
                    {userData.role === "author" && (
                      <span className="position-absolute top-100 start-50 translate-middle badge rounded-pill bg-success">
                        Author
                      </span>
                    )}
                    {userData.role === "Pending" && (
                      <span className="position-absolute bottom-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                        Pending
                      </span>
                    )}
                  </div>

                  <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center align-items-md-start">
                    <h2 className="mb-1 fw-bold d-flex align-items-center text-center gap-1">
                      {userData.username}
                      {userData.role === "author" && (
                        <i
                          className="bi bi-patch-check-fill text-primary"
                          title="Verified Author"
                        ></i>
                      )}
                    </h2>

                    <p className="text-muted mb-2">{userData.email}</p>

                    <div className="SocialLinks d-flex gap-3 mt-2">
                      {userData.socialLinks &&
                        Object.entries(userData.socialLinks)
                          .filter(([, value]) => value !== "")
                          .map(([key, value]) => {
                            let icon;
                            switch (key) {
                              case "linkedin":
                                icon = (
                                  <i className="bi bi-linkedin text-primary fs-5"></i>
                                );
                                break;
                              case "github":
                                icon = <i className="bi bi-github fs-5"></i>;
                                break;
                              case "portfolio":
                                icon = (
                                  <i className="bi bi-globe text-success fs-5"></i>
                                );
                                break;
                              case "facebook":
                                icon = (
                                  <i className="bi bi-facebook text-primary fs-5"></i>
                                );
                                break;
                              case "instagram":
                                icon = (
                                  <i className="bi bi-instagram text-danger fs-5"></i>
                                );
                                break;
                              default:
                                icon = (
                                  <i className="bi bi-link-45deg fs-5"></i>
                                );
                            }

                            return (
                              <a
                                key={key}
                                href={value}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-decoration-none text-dark"
                              >
                                {icon}
                              </a>
                            );
                          })}
                    </div>

                    {!profileComplete && (
                      <div className="alert alert-warning py-2 px-3 d-inline-block">
                        <small className="fw-medium">
                          Complete your profile to access all features
                        </small>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 mt-md-0">
                    <button
                      onClick={() =>
                        navigate("/userdashboard/complete-profile")
                      }
                      className="btn btn-primary d-flex align-items-center mx-auto mx-md-0"
                    >
                      <FaUserEdit className="me-2" />
                      {profileComplete ? "Edit Profile" : "Complete Profile"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3 mb-4">
          <div className="col-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="statWrap card-body d-flex align-items-center">
                <div className="icon-bg bg-primary bg-opacity-10 p-3 rounded-3 me-3 ">
                  <FaPenAlt className="icon text-primary fs-4" />
                </div>
                <div className="statText">
                  <h3 className="fw-bold mb-0">{stats.posts}</h3>
                  <h6 className="text-muted fw-normal mb-0">Blog Post</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="statWrap card-body d-flex align-items-center">
                <div className="icon-bg bg-danger bg-opacity-10 p-3 rounded-3 me-3">
                  <FaHeart className="icon text-danger fs-4" />
                </div>
                <div className="statText">
                  <h3 className="fw-bold mb-0">{stats.likes}</h3>
                  <h6 className="text-muted fw-normal mb-0">Like</h6>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="statWrap card-body d-flex align-items-center">
                <div className="icon-bg bg-info bg-opacity-10 p-3 rounded-3 me-3">
                  <FaComments className="icon text-info fs-4" />
                </div>
                <div className="statText">
                  <h3 className="fw-bold mb-0">{stats.comments}</h3>
                  <h6 className="text-muted fw-normal mb-0 ">Comment</h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Author Tools */}
        {userData.role === "author" && (
          <>
            <h4 className="fw-bold mb-3 d-flex align-items-center">
              <FaChartBar className="me-2 text-primary" />
              Author Tools
            </h4>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start">
                      <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                        <FaBlog className="text-primary fs-4" />
                      </div>
                      <div>
                        <h5 className="fw-bold">Manage Blogs</h5>
                        <p className="text-muted mb-3">
                          View, edit, or manage your published blog posts.
                        </p>
                        <button
                          onClick={() =>
                            navigate("/Userdashboard/viewallblogs")
                          }
                          className="btn btn-outline-primary rounded-pill px-4"
                        >
                          Go to My Blogs
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start">
                      <div className="bg-success bg-opacity-10 p-3 rounded-3 me-3">
                        <FaPlusSquare className="text-success fs-4" />
                      </div>
                      <div>
                        <h5 className="fw-bold">Write New Blog</h5>
                        <p className="text-muted mb-3">
                          Start writing a new blog post and share your ideas.
                        </p>
                        <button
                          onClick={() => navigate("/Userdashboard/createblog")}
                          className="btn btn-outline-success rounded-pill px-4"
                        >
                          Write Blog
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UserDash;
