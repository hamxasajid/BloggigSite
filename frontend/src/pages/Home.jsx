import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaArrowRight,
  FaPenFancy,
  FaBookOpen,
  FaUser,
  FaUserCircle,
} from "react-icons/fa";
import "./Homepage.css";

const Home = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = "https://bloggigsite-production.up.railway.app";

  useEffect(() => {
    axios
      .get(`${url}/api/blogs`)
      .then((response) => {
        const published = response.data
          .filter((post) => post.status === "published")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setLatestPosts(published);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
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

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section position-relative overflow-hidden">
        <div className="container position-relative z-index-1">
          <div className="row min-vh-75 align-items-center py-5">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-3 fw-bold text-white mb-4">
                Welcome to <span className="text-primary">The Post</span>
              </h1>
              <p className="lead text-white-50 mb-5">
                A Platform for Curious Minds, Where Ideas Unfold. Discover
                thought-provoking content from passionate writers.
              </p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Link
                  to="/blogs"
                  onClick={scrollToTop}
                  className="btn btn-light btn-lg px-4 py-3 rounded-pill d-flex align-items-center"
                >
                  <FaBookOpen className="me-2" />
                  Explore All Posts
                </Link>
                <Link
                  to="/Userdashboard/createblog"
                  onClick={scrollToTop}
                  className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill d-flex align-items-center"
                >
                  <FaPenFancy className="me-2" />
                  Write a Post
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="home-hero-overlay"></div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-5 py-lg-7 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold display-5 mb-3 position-relative d-inline-block">
              Latest Articles
              <span className="title-underline"></span>
            </h2>
            <p className="text-muted lead">
              Discover our most recent publications
            </p>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger text-center">
              Error loading posts: {error}
            </div>
          )}

          <div className="row g-4">
            {latestPosts.map((post) => (
              <div className="col-lg-4 col-md-6 mb-4" key={post._id}>
                <div className="card homeCard h-100 border-0 shadow-hover transition-all">
                  {/* Image with hover effect */}
                  <Link
                    to={`/blog/${post._id}`}
                    onClick={scrollToTop}
                    className="position-relative overflow-hidden rounded-top"
                    style={{ display: "block", height: "250px" }}
                  >
                    <img
                      src={
                        post.coverImage ||
                        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                      }
                      className="img-fluid w-100 h-100 object-cover transition-all"
                      alt={post.title}
                      style={{ transition: "transform 0.5s ease" }}
                    />
                    <div className="image-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-0 transition-all"></div>
                    <div className="read-more-overlay position-absolute top-50 start-50 translate-middle text-white opacity-0 transition-all">
                      <span className="badge bg-primary rounded-pill px-3 py-2 d-flex align-items-center">
                        Read Article <FaArrowRight className="ms-2" />
                      </span>
                    </div>
                  </Link>

                  {/* Card body */}
                  <div className="card-body p-4 d-flex flex-column">
                    {/* Author and date */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge bg-light text-dark rounded-pill px-3 py-1 small">
                        <FaUser className="me-1" />
                        {post.user?.username || "Unknown"}
                      </span>
                      <span className="text-muted small">
                        {moment(post.createdAt).fromNow()}
                      </span>
                    </div>

                    {/* Title */}
                    <h5
                      className="card-title fw-bold mb-3 line-clamp-2"
                      style={{ minHeight: "3em" }}
                    >
                      {post.title.slice(0, 55) +
                        (post.title.length > 55 ? "..." : "")}
                    </h5>

                    {/* Excerpt */}
                    <p
                      className="card-text text-muted mb-4 line-clamp-3"
                      style={{ minHeight: "4.5em" }}
                    >
                      {truncateContent(post.content, 120)}
                    </p>

                    {/* Category tags */}
                    <div className="mb-4">
                      {post.categories?.slice(0, 2).map((category, index) => (
                        <span
                          key={index}
                          className="badge bg-light text-dark me-2 mb-2"
                        >
                          #{category}
                        </span>
                      ))}
                    </div>

                    {/* Read more button */}
                    <Link
                      to={`/blog/${post._id}`}
                      onClick={scrollToTop}
                      className="cta m-auto"
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
            ))}
          </div>

          {!loading && !error && latestPosts.length > 0 && (
            <div className="text-center mt-5">
              <Link
                to="/blogs"
                onClick={scrollToTop}
                className="btn btn-primary px-4 py-3 rounded-pill"
              >
                View All Posts
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 py-lg-7 bg-white">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="text-center p-4 feature-card">
                <div className="feature-icon bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-4">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                </div>
                <h4 className="h5 mb-3">Diverse Content</h4>
                <p className="text-muted mb-0">
                  Explore articles across technology, science, culture and more
                  from passionate writers.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4 feature-card">
                <div className="feature-icon bg-success bg-opacity-10 text-success rounded-circle mx-auto mb-4">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h4 className="h5 mb-3">Community Driven</h4>
                <p className="text-muted mb-0">
                  Join a growing community of readers and writers who share your
                  interests.
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-center p-4 feature-card">
                <div className="feature-icon bg-warning bg-opacity-10 text-warning rounded-circle mx-auto mb-4">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h4 className="h5 mb-3">Easy Publishing</h4>
                <p className="text-muted mb-0">
                  Share your thoughts with our simple and intuitive publishing
                  platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-5 py-lg-7 bg-primary text-white cta-section">
        <div className="container text-center">
          <h2 className="display-6 fw-bold mb-4">
            Ready to share your thoughts?
          </h2>
          <p className="lead mb-5 opacity-75">
            Join our community of writers and readers today.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link
              to="/signup"
              onClick={scrollToTop}
              className="btn btn-light btn-lg px-4 py-3 rounded-pill"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              onClick={scrollToTop}
              className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
