import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import "./pages.css";
import {
  FaSearch,
  FaThumbsUp,
  FaClock,
  FaUser,
  FaFilter,
  FaArrowRight,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Blogs = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("newest");
  const [totalPages, setTotalPages] = useState(1);
  const postsPerPage = 6;
  const url = "https://bloggigsite-production.up.railway.app";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${url}/api/blogs`);
        setBlogPosts(response.data);
        setTotalPages(
          Math.ceil(
            response.data.filter((post) => post.status === "published").length /
              postsPerPage
          )
        );
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLinkClick = () => {
    setTimeout(scrollToTop, 100);
  };

  const truncateContent = (html, maxLength = 100) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength ? text.substr(0, maxLength) + "..." : text;
  };

  const filteredPosts = useMemo(() => {
    let filtered = blogPosts.filter(
      (post) =>
        post.status === "published" &&
        (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          post.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    switch (filter) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "most-liked":
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      default:
        break;
    }

    return filtered;
  }, [blogPosts, searchTerm, filter]);

  const currentPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    return filteredPosts.slice(startIndex, startIndex + postsPerPage);
  }, [filteredPosts, currentPage]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredPosts.length / postsPerPage));
    setCurrentPage(1);
  }, [filteredPosts]);

  if (loading) {
    return (
      <div className="loading-screen d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-grow text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen d-flex justify-content-center align-items-center min-vh-100">
        <div className="alert alert-danger text-center" role="alert">
          <h4 className="alert-heading">Error Loading Content</h4>
          <p>{error}</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="blog-hero bg-primary text-white py-5">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h1 className="display-4 fw-bold mb-4">Explore Our Blog</h1>
              <p className="lead mb-5">
                Discover thought-provoking articles on technology, science, and
                modern culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="blog-content py-5">
        <div className="container">
          {/* Search and Filter */}
          <div className="row mb-5">
            <div className="col-md-8 mb-3 mb-md-0">
              <div className="search-bar input-group">
                <span className="input-group-text bg-white border-end-0">
                  <FaSearch className="text-muted" />
                </span>
                <input
                  type="text"
                  className="form-control border-start-1 no-focus-outline"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="filter-select input-group">
                <span className="input-group-text bg-white border-end-1">
                  <FaFilter className="text-muted" />
                </span>
                <select
                  className="form-select no-focus-outline"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most-liked">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="row mb-4">
            <div className="col-12">
              <p className="text-muted mb-0">
                Showing {currentPosts.length} of {filteredPosts.length} articles
              </p>
            </div>
          </div>

          {/* Blog Posts Grid */}
          {currentPosts.length > 0 ? (
            <div className="row g-4">
              {currentPosts.map((post) => (
                <div className="col-lg-4 col-md-6" key={post._id}>
                  <div className="blog-card card h-100 border-0 shadow-sm">
                    <div className="card-img-container">
                      <Link
                        to={`/blog/${post._id}`}
                        onClick={handleLinkClick}
                        className="card-img-link"
                      >
                        <img
                          src={
                            post.coverImage ||
                            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                          }
                          className="img-fluid transition-all"
                          alt={post.title}
                        />
                        <div className="card-img-overlay">
                          <span className="badge topBadge bg-dark bg-opacity-75">
                            {post.category}
                          </span>
                        </div>
                      </Link>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-3">
                        <small className="text-muted">
                          <FaUser className="me-2" />
                          {post.user?.username || "Unknown"}
                        </small>
                        <small className="text-muted">
                          <FaClock className="me-2" />
                          {moment(post.createdAt).fromNow()}
                        </small>
                      </div>

                      <h5
                        className="card-title mb-3"
                        style={{ height: "50px" }}
                      >
                        {post.title.slice(0, 55) +
                          (post.title.length > 55 ? "..." : "")}
                      </h5>

                      <p
                        className="card-text text-muted mb-4"
                        style={{ height: "70px" }}
                      >
                        {truncateContent(post.content, 100)}
                      </p>

                      <div
                        className="d-flex flex-wrap mb-3"
                        style={{ height: "50px" }}
                      >
                        {post.tags?.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="badge bg-light text-dark me-2 mb-2"
                            style={{ height: "20px" }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted small">
                          <FaThumbsUp className="me-1" /> {post.likes} Likes
                        </span>
                        {/* Read more button */}
                        <Link
                          to={`/blog/${post._id}`}
                          onClick={scrollToTop}
                          className="cta"
                        >
                          <span>Continue Reading</span>
                          <svg width="15px" height="10px" viewBox="0 0 13 10">
                            <path d="M1,5 L11,5"></path>
                            <polyline points="8 1 12 5 8 9"></polyline>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results text-center py-5">
              <div className="alert alert-info">
                No articles found matching your search criteria.
              </div>
            </div>
          )}

          {/* Pagination */}
          {filteredPosts.length > postsPerPage && (
            <nav className="blog-pagination mt-5">
              <ul className="pagination justify-content-center">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => {
                      setCurrentPage(currentPage - 1);
                      scrollToTop();
                    }}
                    disabled={currentPage === 1}
                  >
                    <FiChevronLeft /> Previous
                  </button>
                </li>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <li
                      key={pageNum}
                      className={`page-item ${
                        currentPage === pageNum ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => {
                          setCurrentPage(pageNum);
                          scrollToTop();
                        }}
                      >
                        {pageNum}
                      </button>
                    </li>
                  );
                })}

                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => {
                      setCurrentPage(currentPage + 1);
                      scrollToTop();
                    }}
                    disabled={currentPage === totalPages}
                  >
                    Next <FiChevronRight />
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blogs;
