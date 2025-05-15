import React from "react";
import { Link } from "react-router-dom";
import { FaPenAlt, FaBookReader } from "react-icons/fa";
import "./About.css";

const About = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLinkClick = () => {
    setTimeout(scrollToTop, 100);
  };

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content text-center text-white">
            <h1 className="display-3 fw-bold mb-4">About The Post</h1>
            <p className="lead mb-5">
              Discover who we are, what drives us, and how we're building a
              platform for curious minds.
            </p>
            <Link
              to="/blogs"
              onClick={handleLinkClick}
              className="btn btn-light btn-lg px-4 py-3 rounded-pill"
            >
              Explore Our Content
            </Link>
          </div>
        </div>
        <div className="hero-overlay"></div>
      </section>

      {/* Mission Section */}
      <section className="py-5 py-lg-7 mission-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-5 position-relative">
                Our Mission
                <span className="title-underline"></span>
              </h2>
              <div className="mission-content">
                <p className="fs-5 mb-4">
                  At <strong className="text-primary">The Post</strong>, our
                  mission is to empower individuals through thoughtful writing,
                  inspiring ideas, and a diverse range of perspectives. We
                  believe stories have the power to shape minds, spark change,
                  and build communities.
                </p>
                <p className="fs-5">
                  Whether you're a reader or writer, we're here to help you
                  explore the world, question the norm, and grow
                  intellectually—one post at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-5 py-lg-7 bg-light features-section">
        <div className="container">
          <h2 className="display-5 fw-bold mb-5 text-center position-relative">
            What We Offer
            <span className="title-underline"></span>
          </h2>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="feature-card card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-primary bg-opacity-10 text-primary rounded-circle mx-auto mb-4">
                    <FaPenAlt size={24} />
                  </div>
                  <h5 className="card-title fw-bold">Engaging Blogs</h5>
                  <p className="card-text">
                    Dive into original content written by passionate authors
                    covering a wide range of topics including tech, education,
                    lifestyle, and more.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="feature-card card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-success bg-opacity-10 text-success rounded-circle mx-auto mb-4">
                    <FaBookReader size={24} />
                  </div>
                  <h5 className="card-title fw-bold">Creative Freedom</h5>
                  <p className="card-text">
                    Writers have the freedom to express their voice. We
                    encourage authentic storytelling, diverse opinions, and
                    thoughtful dialogue.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="feature-card card border-0 shadow-sm h-100">
                <div className="card-body text-center p-4">
                  <div className="feature-icon bg-warning bg-opacity-10 text-warning rounded-circle mx-auto mb-4">
                    <i class="bi bi-palette"></i>
                  </div>
                  <h5 className="card-title fw-bold">Reader-First Design</h5>
                  <p className="card-text">
                    A clean, responsive, and distraction-free reading experience
                    optimized for clarity, comfort, and curiosity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision for the Future Section */}
      <section className="py-5 py-lg-7 vision-section bg-light">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 className="display-5 fw-bold mb-4 position-relative">
                Our Vision for the Future
                <span className="title-underline"></span>
              </h2>
              <p className="lead text-muted">
                Building the next generation platform for thoughtful content and
                meaningful conversations
              </p>
            </div>
          </div>

          <div className="row justify-content-center align-items-center g-5">
            <div className="col-lg-6">
              <div className="vision-card p-4 p-lg-5 h-100">
                <h3 className="h4 fw-bold mb-4 text-primary">
                  The Big Picture
                </h3>
                <p className="fs-5 mb-4">
                  At <strong className="text-primary">The Post</strong>, we're
                  building more than a blogging platform. We're crafting a
                  vibrant ecosystem where readers, writers, and thinkers
                  collaborate to spark conversations and inspire change.
                </p>
                <p className="fs-5 mb-4">
                  Our goal is to open the platform to guest contributors, add
                  interactive features, support multimedia storytelling, and
                  eventually launch a dedicated mobile experience.
                </p>
                <p className="fs-5">
                  We believe the future of blogging lies in empowering creators
                  — not controlling them. This is just the beginning.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="vision-features p-4 p-lg-5 h-100">
                <h3 className="h4 fw-bold mb-4 text-primary">
                  Upcoming Features
                </h3>
                <ul className="list-unstyled">
                  <li className="d-flex mb-3">
                    <span className="feature-icon me-3 text-primary">🚀</span>
                    <span className="fs-5">
                      Expand community features and profiles
                    </span>
                  </li>
                  <li className="d-flex mb-3">
                    <span className="feature-icon me-3 text-primary">🧠</span>
                    <span className="fs-5">
                      Add AI-powered suggestions for readers & writers
                    </span>
                  </li>
                  <li className="d-flex mb-3">
                    <span className="feature-icon me-3 text-primary">💬</span>
                    <span className="fs-5">
                      Introduce reader discussions & reactions
                    </span>
                  </li>
                </ul>

                <div className="contributor-cta mt-5 p-4 rounded bg-white shadow-sm">
                  <h4 className="h5 fw-bold mb-3">Want to contribute?</h4>
                  <p className="mb-3">
                    Your ideas matter! Share your suggestions or contribute your
                    voice.
                  </p>
                  <a
                    href="mailto:connect.thepost+contributer@gmail.com"
                    className="btn btn-outline-primary d-inline-flex align-items-center flex-wrap"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Email us at{" "}
                    <span className="ms-1 fw-bold">
                      contributer@thepost.com
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 py-lg-7 cta-section bg-primary text-white">
        <div className="container text-center">
          <h2 className="display-5 fw-bold mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="lead mb-5">
            Whether you want to read thought-provoking content or share your own
            stories, we welcome you.
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Link
              to="/signup"
              onClick={handleLinkClick}
              className="btn btn-light btn-lg px-4 py-3 rounded-pill"
            >
              Sign Up Now
            </Link>
            <Link
              to="/Userdashboard/createblog"
              onClick={handleLinkClick}
              className="btn btn-outline-light btn-lg px-4 py-3 rounded-pill"
            >
              Start Writing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
