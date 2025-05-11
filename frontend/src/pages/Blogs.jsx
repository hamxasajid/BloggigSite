import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import {
  FaSearch,
  FaThumbsUp,
  FaClock,
  FaUser,
  FaFilter,
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
    setCurrentPage(1); // Reset to first page when filters change
  }, [filteredPosts]);

  if (loading) {
    return (
      <div className="text-center py-5 min-vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5 min-vh-100 d-flex justify-content-center align-items-center">
        <div className="alert alert-danger" role="alert">
          Error loading blog posts: {error}
        </div>
      </div>
    );
  }

  return (
    <section className="py-5 bg-light" id="posts">
      <div className="container min-vh-100">
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="text-center mb-4">Latest Blog Posts</h2>

            {/* Search and Filter Bar */}
            <div className="card mb-4 shadow-sm">
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-8">
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <FaSearch className="text-muted" />
                      </span>
                      <input
                        type="text"
                        className="form-control border-start-0"
                        placeholder="Search by title, content, or tags..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text bg-white border-end-0">
                        <FaFilter className="text-muted" />
                      </span>
                      <select
                        className="form-select"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="most-liked">Most Liked</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results count */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="mb-0 text-muted">
                Showing {currentPosts.length} of {filteredPosts.length} posts
              </p>
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        {currentPosts.length > 0 ? (
          <div className="row">
            {currentPosts.map((post) => (
              <div className="col-md-4 mb-4" key={post._id}>
                <div className="card h-100 shadow-sm border-0 hover-effect">
                  <div className="position-relative">
                    <img
                      src={post.coverImage}
                      className="card-img-top"
                      alt={post.title}
                      style={{
                        objectFit: "cover",
                        borderTopLeftRadius: "calc(0.25rem - 1px)",
                        borderTopRightRadius: "calc(0.25rem - 1px)",
                      }}
                    />
                    <div className="position-absolute top-0 end-0 m-2">
                      <span className="badge bg-dark bg-opacity-75">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <div className="w-100 d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">
                        <FaUser className="me-1" />
                        {post.user?.username || "Unknown Author"}
                      </small>
                      <small className="text-muted">
                        <FaClock className="me-1 " />
                        {moment(post.createdAt).fromNow()}
                      </small>
                    </div>

                    <h5 className="fs-5 mb-3" style={{ minHeight: "3em" }}>
                      {post.title}
                    </h5>

                    {/* Status and read time */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span
                        className={`badge ${
                          post.status === "published"
                            ? "bg-success"
                            : "bg-warning"
                        }`}
                      >
                        {post.status.charAt(0).toUpperCase() +
                          post.status.slice(1)}
                      </span>
                      <span className="small text-muted">
                        <FaClock className="me-1" /> {post.readTime} min read
                      </span>
                    </div>

                    {/* Truncated content */}
                    <p
                      className="card-text flex-grow-1"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {truncateContent(post.content, 100)}
                    </p>

                    {/* Tags */}
                    <div className="mb-3">
                      {post.tags &&
                        post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="badge bg-light text-dark me-1 mb-1"
                          >
                            #{tag}
                          </span>
                        ))}
                      {post.tags?.length > 3 && (
                        <span className="badge bg-light text-dark">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Likes count */}
                    <div className="d-flex justify-content-between align-items-center mt-auto">
                      <span className="small text-muted">
                        <FaThumbsUp className="me-1" /> {post.likes} Likes
                      </span>
                      <Link
                        to={`/blog/${post._id}`}
                        className="btn btn-sm btn-outline-primary"
                        onClick={scrollToTop}
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <div className="alert alert-info" role="alert">
              No blog posts found matching your criteria.
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredPosts.length > postsPerPage && (
          <nav aria-label="Blog pagination" className="mt-4">
            <ul className="pagination justify-content-center">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(currentPage - 1)}
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
                      onClick={() => setCurrentPage(pageNum)}
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
                  onClick={() => setCurrentPage(currentPage + 1)}
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
  );
};

export default Blogs;
