import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const ManageAllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const url = "https://bloggigsite-production.up.railway.app";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    // Redirect if no user
    if (!storedUser) {
      navigate("/login");
      return;
    }

    // Fetch all blogs
    axios
      .get(`${url}/api/blogs`)
      .then((res) => {
        setBlogs(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch blogs", err);
        setLoading(false);
      });
  }, [navigate]);

  const handleDelete = async (blogId) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/blogs/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete blog");
    }
  };

  return (
    <div className="container py-5 min-vh-100">
      <h2 className="text-center mb-4">Manage All Blogs</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : blogs.length > 0 ? (
        <div className="row g-4">
          {blogs.map((blog) => (
            <div className="col-md-4" key={blog._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body d-flex flex-column">
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="card-img-top"
                    style={{
                      maxHeight: "200px",
                      objectFit: "cover",
                      marginBottom: "1rem",
                    }}
                  />
                  <h5 className="card-title h-50">{blog.title}</h5>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <p className="card-text text-muted mb-1">
                      Author: {blog.user?.username || "Unknown Author"}
                    </p>
                    <p className="card-text">
                      Date: {new Date(blog.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-auto d-flex justify-content-between">
                    <Link
                      to={`/blog/${blog._id}`}
                      className="btn btn-sm btn-info w-100"
                    >
                      View
                    </Link>
                    <button
                      className="btn btn-sm btn-warning w-100 ms-2"
                      onClick={() => navigate(`/admin/editblog/${blog._id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger w-100 ms-2"
                      onClick={() => handleDelete(blog._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No blogs found.</p>
      )}
    </div>
  );
};

export default ManageAllBlogs;
