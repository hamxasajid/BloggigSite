import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";

const Blogs = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = "https://bloggigsite-production.up.railway.app";

  useEffect(() => {
    axios
      .get(`${url}/api/blogs`)
      .then((response) => {
        setBlogPosts(response.data);
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

  if (loading) {
    return <div className="text-center py-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger">Error: {error}</div>;
  }

  return (
    <section className="py-5 bg-light" id="posts">
      <div className="container min-vh-100">
        <h2 className="text-center mb-4">Latest Blog Posts</h2>
        <div className="row">
          {blogPosts
            .filter((post) => post.status === "published")
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((post) => (
              <div className="col-md-4 mb-4" key={post._id}>
                <div className="card h-100 shadow-sm border-0 hover-effect">
                  <img
                    src={post.coverImage}
                    className="card-img-top"
                    alt={post.title}
                    style={{
                      aspectRatio: "16/9",
                      borderTopLeftRadius: "calc(0.25rem - 1px)",
                      borderTopRightRadius: "calc(0.25rem - 1px)",
                    }}
                  />
                  <div className="card-body">
                    <div className="w-100 d-flex justify-content-between align-items-center">
                      <small className="text-muted d-block mb-1 w-100 ">
                        By {post.user?.username || "Unknown Author"}
                      </small>
                      <small className="text-secondary w-100 text-end">
                        {moment(post.createdAt).fromNow()}
                      </small>
                    </div>
                    <div style={{ height: "80px" }}>
                      <h5 className="fs-5">{post.title}</h5>
                    </div>

                    {/* Status and read time */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
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
                        <i className="far fa-clock me-1"></i> {post.readTime}{" "}
                        min read
                      </span>
                    </div>

                    {/* Truncated content */}
                    <p
                      className="card-text"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: "3em",
                      }}
                    >
                      {truncateContent(post.content)}
                    </p>

                    {/* Category and Tags */}
                    <div className="mb-3">
                      <span className="badge bg-primary me-1">
                        {post.category}
                      </span>
                      {post.tags &&
                        post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="badge bg-light text-dark me-1"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>

                    {/* Likes count */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <span className="small text-muted">
                        <i className="far fa-thumbs-up me-1"></i> {post.likes}{" "}
                        Likes
                      </span>
                    </div>
                  </div>

                  {/* Card footer with date/time and view button */}
                  <div className="card-footer bg-white border-0 d-flex justify-content-between align-items-center">
                    <Link
                      to={`/blog/${post._id}`}
                      className="btn btn-sm btn-outline-primary w-100"
                    >
                      Read More <i className="fas fa-arrow-right ms-1"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Blogs;
