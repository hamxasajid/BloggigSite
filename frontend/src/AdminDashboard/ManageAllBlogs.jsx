import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";
import {
  FaSearch,
  FaFilter,
  FaUser,
  FaEdit,
  FaTrash,
  FaEye,
  FaCalendarAlt,
  FaTags,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const ManageAllBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [authorFilter, setAuthorFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const url = "https://bloggigsite-production.up.railway.app";
  const blogsPerPage = 6;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${url}/api/blogs`);
        setBlogs(response.data || []);
      } catch (err) {
        console.error("Failed to fetch blogs", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [navigate]);

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

  // Get unique authors for filter dropdown
  const uniqueAuthors = useMemo(() => {
    const authors = new Map();
    blogs.forEach((blog) => {
      if (blog.user) {
        authors.set(blog.user._id, blog.user.username);
      }
    });
    return Array.from(authors, ([id, username]) => ({ id, username }));
  }, [blogs]);

  // Filter blogs based on search and filters
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.tags &&
          blog.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )) ||
        blog.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || blog.status === statusFilter;
      const matchesAuthor =
        authorFilter === "all" || blog.user?._id === authorFilter;

      return matchesSearch && matchesStatus && matchesAuthor;
    });
  }, [blogs, searchTerm, statusFilter, authorFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);
  const currentBlogs = useMemo(() => {
    const startIndex = (currentPage - 1) * blogsPerPage;
    return filteredBlogs.slice(startIndex, startIndex + blogsPerPage);
  }, [filteredBlogs, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>
      );
    }

    return (
      <nav aria-label="Blog pagination">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FaChevronLeft />
            </button>
          </li>
          {pages}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight />
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  if (loading) {
    return (
      <div className="container py-5 min-vh-100 d-flex justify-content-center align-items-center">
        <div
          className="spinner-border text-primary"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 min-vh-100">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Manage All Blogs</h2>
          </div>

          {/* Search and Filter Bar */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <FaSearch />
                    </span>
                    <input
                      type="text"
                      className="form-control no-focus-outline"
                      placeholder="Search blogs by title, content, or tags..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <FaFilter />
                    </span>
                    <select
                      className="form-select no-focus-outline"
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="all">All Statuses</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <FaUser />
                    </span>
                    <select
                      className="form-select no-focus-outline"
                      value={authorFilter}
                      onChange={(e) => {
                        setAuthorFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                    >
                      <option value="all">All Authors</option>
                      {uniqueAuthors.map((author) => (
                        <option key={author.id} value={author.id}>
                          {author.username}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="text-muted mb-0">
              Showing {currentBlogs.length} of {filteredBlogs.length} blogs
              {filteredBlogs.length !== blogs.length &&
                ` (filtered from ${blogs.length} total)`}
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Blog List */}
      {filteredBlogs.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <h4 className="text-muted">
              No blogs found matching your criteria
            </h4>
            <button
              className="btn btn-outline-primary mt-3"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setAuthorFilter("all");
                setCurrentPage(1);
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {currentBlogs.map((blog) => (
              <div className="col-md-4" key={blog._id}>
                <div className="card h-100 shadow-sm">
                  <div
                    className="card-img-top overflow-hidden"
                    style={{ height: "250px" }}
                  >
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      className="img-fluid w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0">{blog.title}</h5>
                      <span
                        className={`badge ${
                          blog.status === "published"
                            ? "bg-success"
                            : "bg-warning"
                        }`}
                      >
                        {blog.status}
                      </span>
                    </div>

                    <div className="mb-3 d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center text-muted mb-1">
                        <FaUser className="me-2" size={14} />
                        <small>{blog.user?.username || "Unknown Author"}</small>
                      </div>
                      <div className="d-flex align-items-center text-muted">
                        <FaCalendarAlt className="me-2" size={14} />
                        <small>
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="badge bg-primary me-1">
                        {blog.category}
                      </span>
                      {blog.tags?.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="badge bg-light text-dark me-1"
                        >
                          <FaTags className="me-1" size={10} /> {tag}
                        </span>
                      ))}
                      {blog.tags?.length > 3 && (
                        <span className="badge bg-light text-dark">
                          +{blog.tags.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto d-flex justify-content-between">
                      <Link
                        to={`/blog/${blog._id}`}
                        className="btn btn-sm btn-outline-info d-flex justify-content-center align-items-center w-100"
                        title="View"
                      >
                        <FaEye /> &nbsp; View
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-warning mx-2 d-flex justify-content-center align-items-center w-100"
                        onClick={() => navigate(`/admin/editblog/${blog._id}`)}
                        title="Edit"
                      >
                        <FaEdit /> &nbsp; Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger d-flex justify-content-center align-items-center w-100"
                        onClick={() => handleDelete(blog._id)}
                        title="Delete"
                      >
                        <FaTrash /> &nbsp; Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-4 ">{renderPagination()}</div>
        </>
      )}
    </div>
  );
};

export default ManageAllBlogs;
