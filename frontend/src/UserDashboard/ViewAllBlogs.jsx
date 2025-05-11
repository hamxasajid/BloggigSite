import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaClock,
  FaTags,
  FaLayerGroup,
  FaEye,
  FaSearch,
  FaSpinner,
} from "react-icons/fa";

const ViewAllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();
  const url = "https://bloggigsite-production.up.railway.app";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
    fetchBlogs();
  }, [navigate]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${url}/api/user/blogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data.blogs || []);
      setFilteredBlogs(res.data.blogs || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch blogs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || blog.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredBlogs(filtered);
  }, [searchTerm, statusFilter, blogs]);

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${url}/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete blog. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "published":
        return "badge bg-success";
      case "draft":
        return "badge bg-warning text-dark";
      case "archived":
        return "badge bg-secondary";
      default:
        return "badge bg-info";
    }
  };

  return (
    <div className="container py-4 min-vh-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">My Blog Posts</h2>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/Userdashboard/createblog")}
        >
          Create New Blog
        </button>
      </div>

      {/* Filters and Search */}
      <div className="row mb-4 g-3">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text">
              <FaSearch />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={fetchBlogs}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <FaSpinner className="fa-spin me-2" size={24} />
          <p>Loading your blogs...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <h4 className="text-muted">
              {blogs.length === 0
                ? "You haven't created any blogs yet"
                : "No blogs match your search"}
            </h4>
            <button
              className="btn btn-primary mt-3"
              onClick={() => navigate("/Userdashboard/createblog")}
            >
              Create Your First Blog
            </button>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredBlogs.map((blog) => (
            <div className="col" key={blog._id}>
              <div className="card h-100 shadow-sm hover-shadow transition">
                {blog.coverImage && (
                  <img
                    src={blog.coverImage}
                    alt="Cover"
                    className="card-img-top"
                    style={{ objectFit: "contain" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className={getStatusBadge(blog.status)}>
                      {blog.status.charAt(0).toUpperCase() +
                        blog.status.slice(1)}
                    </span>
                    <small className="text-muted">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <h5 className="card-title">{blog.title}</h5>
                  <div className="mt-auto">
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <small className="text-muted d-flex align-items-center">
                        <FaLayerGroup className="me-1" /> {blog.category}
                      </small>
                      <small className="text-muted d-flex align-items-center">
                        <FaClock className="me-1" /> {blog.readTime} min read
                      </small>
                      {blog.tags?.length > 0 && (
                        <small className="text-muted d-flex align-items-center">
                          <FaTags className="me-1" />{" "}
                          {blog.tags.slice(0, 2).join(", ")}
                          {blog.tags.length > 2 && "..."}
                        </small>
                      )}
                    </div>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm flex-grow-1"
                        onClick={() =>
                          navigate(`/Userdashboard/editblog/${blog._id}`)
                        }
                      >
                        <FaEdit className="me-1" /> Edit
                      </button>
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => navigate(`/blog/${blog._id}`)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(blog._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAllBlogs;
