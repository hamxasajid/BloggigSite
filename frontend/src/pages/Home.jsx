import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";

const Home = () => {
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/blogs")
      .then((response) => {
        const published = response.data
          .filter((post) => post.status === "published")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3); // Only latest 3 posts
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
    <div>
      {/* Hero Section */}
      <section
        className="text-white text-center py-5"
        style={{
          background:
            "linear-gradient(rgba(13, 110, 253, 0.8), rgba(13, 110, 253, 0.8)), rgba(13, 110, 253, 0.8)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="container">
          <h3 className="display-4 fw-bold">The Post</h3>
          <p className="lead">
            A Platform for Curious Minds, Where Ideas Unfold
          </p>
          <a href="#posts" className="btn btn-light mt-3">
            Read Latest Posts
          </a>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-5" id="posts">
        <div className="container">
          <h2 className="mb-4">Latest Posts</h2>

          {loading && <div className="text-center py-3">Loading...</div>}
          {error && (
            <div className="text-center text-danger">Error: {error}</div>
          )}

          <div className="row">
            {latestPosts.map((post) => (
              <div className="col-md-4 mb-4" key={post._id}>
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={post.coverImage}
                    className="card-img-top"
                    alt={post.title}
                    style={{
                      aspectRatio: "16/9",
                      borderTopLeftRadius: "calc(0.25rem - 1px)",
                      borderTopRightRadius: "calc(0.25rem - 1px)",
                      flexShrink: 0,
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
                    <p className="card-text">{truncateContent(post.content)}</p>

                    <div className=" mt-2">
                      <Link
                        to={`/blog/${post._id}`}
                        className="btn btn-primary btn-sm w-100"
                      >
                        Read More
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
