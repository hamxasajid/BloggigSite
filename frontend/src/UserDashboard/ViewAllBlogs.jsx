import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewAllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const url = "https://bloggigsite-production.up.railway.app";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      // Removed unused setUserData call
    } else {
      navigate("/login");
    }
    // Removed unused setLoading call
  }, [navigate]);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${url}/api/user/blogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch blogs");
    }
  };

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
      setError("Failed to delete blog");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="container mt-5 min-vh-100">
      <h2 className="mb-4 ">All Blogs</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="row">
          {blogs.map((blog) => (
            <div className="col-md-6 mb-4" key={blog._id}>
              <div className="card shadow-sm w-75">
                {blog.coverImage && (
                  <img
                    src={blog.coverImage}
                    alt="Cover"
                    className="card-img-top"
                    style={{ aspectRatio: "16/9" }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{blog.title}</h5>
                  <p className="card-text">
                    <strong>Category:</strong> {blog.category} <br />
                    <strong>Status:</strong> {blog.status} <br />
                    <strong>Tags:</strong> {blog.tags?.join(", ")} <br />
                    <strong>Read Time:</strong> {blog.readTime} min
                  </p>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-primary w-100"
                      onClick={() =>
                        navigate(`/Userdashboard/editblog/${blog._id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger w-100 ms-2"
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
      )}
    </div>
  );
};

export default ViewAllBlogs;
