import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
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

  const truncateContent = (html, maxLength = 100) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    return text.length > maxLength ? text.substr(0, maxLength) + "..." : text;
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-primary text-white py-5">
        <div className="container py-5">
          <div className="row justify-content-center py-lg-5">
            <div className="col-lg-8 text-center">
              <h1 className="display-4 fw-bold mb-4">The Post</h1>
              <p className="lead mb-4">
                A Platform for Curious Minds, Where Ideas Unfold
              </p>
              <Link to="/blogs" className="btn btn-light btn-lg px-4 me-2">
                Explore All Posts
              </Link>
              <Link
                to="/Userdashboard/createblog"
                className="btn btn-outline-light btn-lg px-4"
              >
                Write a Post
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="latest-posts py-5 bg-light" id="posts">
        <div className="container py-4">
          <div className="section-header text-center mb-5">
            <h2 className="display-5 fw-bold">Latest Articles</h2>
            <p className="text-muted">Discover our most recent publications</p>
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
              <div className="col-lg-4 col-md-6" key={post._id}>
                <div className="card h-100 border-0 shadow-sm overflow-hidden">
                  <div
                    className="card-img-top overflow-hidden"
                    style={{ height: "200px" }}
                  >
                    <img
                      src={
                        post.coverImage ||
                        "https://via.placeholder.com/800x450?text=Blog+Image"
                      }
                      className="img-fluid w-100 h-100 object-fit-cover"
                      alt={post.title}
                    />
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-muted">
                        By {post.user?.username || "Unknown Author"}
                      </small>
                      <small className="text-muted">
                        {moment(post.createdAt).fromNow()}
                      </small>
                    </div>
                    <h3 className="h5 card-title mb-3">{post.title}</h3>
                    <p className="card-text text-muted mb-4">
                      {truncateContent(post.content, 120)}
                    </p>
                    <Link
                      to={`/blog/${post._id}`}
                      className="btn btn-outline-primary w-100"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!loading && !error && latestPosts.length > 0 && (
            <div className="text-center mt-5">
              <Link to="/blogs" className="btn btn-primary px-4">
                View All Posts
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="cta-section py-5 bg-white">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="h3 mb-4">Ready to share your thoughts?</h2>
              <p className="lead text-muted mb-4">
                Join our community of writers and readers today.
              </p>
              <Link to="/signup" className="btn btn-primary btn-lg px-4">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
