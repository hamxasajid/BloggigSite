import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserEdit,
  FaBlog,
  FaPlusSquare,
  FaUserCircle,
  FaChartLine,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";

const UserDash = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(false);
  const [error, setError] = useState(null);
  const [blogCount, setBlogCount] = useState(0);
  const [stats, setStats] = useState({
    posts: blogCount,
    Likes: 0,
    comments: 0,
  });
  const navigate = useNavigate();
  const url = "https://bloggigsite-production.up.railway.app";

  useEffect(() => {
    axios
      .get(`${url}/api/user/blogs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setBlogCount(res.data.blogs.length);
        setStats((prevStats) => ({
          ...prevStats,
          posts: res.data.blogs.length,
        }));
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${url}/api/user/blogs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        const blogs = res.data.blogs; // assuming it's an array
        const totalLikes = blogs.reduce(
          (sum, blog) => sum + (blog.likes || 0),
          0
        );

        setBlogCount(totalLikes);
        setStats((prevStats) => ({
          ...prevStats,
          Likes: totalLikes,
        }));
      })
      .catch((err) => {
        console.error("Failed to fetch blogs:", err);
      });
  }, []);

  useEffect(() => {
    const fetchUserComments = async () => {
      try {
        const token = localStorage.getItem("token");

        // 1. Get user blogs
        const blogRes = await axios.get(`${url}/api/user/blogs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userBlogs = blogRes.data.blogs;
        const userBlogIds = userBlogs.map((blog) => blog._id);

        // Log to check blog ids
        console.log("User Blog IDs:", userBlogIds);

        // 2. Get all comments
        const commentRes = await axios.get(`${url}/api/comments`);
        const allComments = commentRes.data.comments;
        const userBlogComments = allComments.filter((comment) =>
          userBlogIds.includes(comment.blogId)
        );
        const commentCount = userBlogComments.length;
        setStats((prevStats) => ({
          ...prevStats,
          Comments: commentCount,
        }));
      } catch (error) {
        console.error("Error fetching user comments:", error);
      }
    };

    fetchUserComments();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch user data
        const userResponse = await axios.get(`${url}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = {
          username: userResponse.data.username || "",
          email: userResponse.data.email,
          phone: userResponse.data.phone || "",
          about: userResponse.data.about || "",
          education: userResponse.data.education || "",
          role: userResponse.data.role || "user",
          profilePicture: userResponse.data.profilePicture || "",
        };

        setUserData(user);
        localStorage.setItem("user", JSON.stringify(user));

        // Check profile completion
        const isProfileComplete =
          user.username &&
          user.email &&
          user.phone &&
          user.about &&
          user.education;
        setProfileComplete(isProfileComplete);

        // Fetch stats (mock data - replace with actual API call)
        setStats({
          posts: 0,
          followers: 0,
          following: 0,
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
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <FaSpinner className="fa-spin me-2" size={32} />
          <p className="mt-2">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div
          className="alert alert-danger text-center"
          style={{ maxWidth: "500px" }}
        >
          <h5>Error Loading Dashboard</h5>
          <p>{error}</p>
          <button
            className="btn btn-primary mt-2"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 min-vh-100">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-md-row align-items-center">
                {/* Profile Picture */}
                <div className="mb-3 mb-md-0 me-md-4">
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
                </div>

                {/* Profile Info */}
                <div className="flex-grow-1 text-center text-md-start">
                  <h2 className="mb-1">
                    {userData.username}
                    {userData.role === "author" && (
                      <span className="badge bg-success ms-2 align-middle">
                        Author
                      </span>
                    )}
                    {userData.role === "Pending" && (
                      <span className="badge bg-warning text-dark ms-2 align-middle fs-6">
                        Pending
                      </span>
                    )}
                  </h2>
                  <p className="text-muted mb-2">{userData.email}</p>

                  {!profileComplete && (
                    <div className="alert alert-warning p-2 d-inline-block">
                      <small>
                        Complete your profile to access all features
                      </small>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <div className="mt-3 mt-md-0">
                  <button
                    onClick={() => navigate("/userdashboard/complete-profile")}
                    className="btn btn-primary d-flex align-items-center"
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

      {/* Stats Section */}
      <div className="row mb-4 g-3">
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                  <i
                    className="bi bi-pencil-fill text-primary"
                    style={{ fontSize: "24px" }}
                  ></i>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">Blog Posts</h6>
                  <h3 className="mb-0">{stats.posts}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                  <i
                    className="bi bi-heart text-success"
                    style={{ fontSize: "24px" }}
                  ></i>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">Likes</h6>
                  <h3 className="mb-0">{stats.Likes}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="bg-warning bg-opacity-10 p-3 rounded me-3">
                  <i
                    className="bi bi-chat-left-text text-warning"
                    style={{ fontSize: "24px" }}
                  ></i>
                </div>
                <div>
                  <h6 className="mb-0 text-muted">Comments</h6>
                  <h3 className="mb-0">{stats.Comments}</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Author Features Section */}
      {userData.role === "author" && (
        <div className="row g-3 mb-4">
          <div className="col-12">
            <h4 className="mb-3">Author Tools</h4>
          </div>

          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm hover-shadow transition">
              <div className="card-body">
                <div className="d-flex align-items-start">
                  <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                    <FaBlog className="text-primary" size={24} />
                  </div>
                  <div>
                    <h5 className="mb-2">Manage Blogs</h5>
                    <p className="text-muted mb-3">
                      View, edit, or manage your published blog posts.
                    </p>
                    <button
                      onClick={() => navigate("/Userdashboard/viewallblogs")}
                      className="btn btn-outline-primary"
                    >
                      Go to My Blogs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm hover-shadow transition">
              <div className="card-body">
                <div className="d-flex align-items-start">
                  <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                    <FaPlusSquare className="text-success" size={24} />
                  </div>
                  <div>
                    <h5 className="mb-2">Create Blog</h5>
                    <p className="text-muted mb-3">
                      Start writing a new blog post to share with your audience.
                    </p>
                    <button
                      onClick={() => navigate("/Userdashboard/createblog")}
                      className="btn btn-outline-success"
                    >
                      Create New Blog
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Section */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-warning bg-opacity-10 p-2 rounded me-3">
                  <FaChartLine className="text-warning" size={20} />
                </div>
                <h5 className="mb-0">Your Activity</h5>
              </div>
              <div className="alert alert-info">
                <small>
                  Analytics dashboard coming soon! Track your blog performance
                  and audience engagement.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDash;
