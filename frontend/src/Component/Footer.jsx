import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark text-white pt-5 pb-4">
      <div className="container">
        <div className="row g-4">
          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex flex-column h-100">
              <h5 className="fw-bold mb-3">The Post</h5>
              <p className="mb-4 text-white-50">
                A Platform for Curious Minds, Where Ideas Unfold. Discover
                thought-provoking content on technology, science, and modern
                culture.
              </p>
              <div className="mt-auto">
                <h6 className="mb-3">Stay Updated</h6>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Your email address"
                    aria-label="Email"
                  />
                  <button className="btn btn-primary" type="button">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3">Explore</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link
                  to="/"
                  className="nav-link p-0 text-white-50"
                  onClick={scrollToTop}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/blogs"
                  className="nav-link p-0 text-white-50"
                  onClick={scrollToTop}
                >
                  All Posts
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/popular"
                  className="nav-link p-0 text-white-50"
                  onClick={scrollToTop}
                >
                  Popular
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/authors"
                  className="nav-link p-0 text-white-50"
                  onClick={scrollToTop}
                >
                  Authors
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/about"
                  className="nav-link p-0 text-white-50"
                  onClick={scrollToTop}
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3">Topics</h5>
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link
                  to="/blogs"
                  className="nav-link p-0 text-white-50"
                  onClick={scrollToTop}
                >
                  Technology
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/blogs"
                  className="nav-link p-0 text-white-50"
                  onClick={scrollToTop}
                >
                  Science
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/blogs"
                  className="nav-link p-0 text-white-50"
                  onClick={scrollToTop}
                >
                  Culture
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/blogs"
                  className="nav-link p-0 text-white-50"
                  onClick={scrollToTop}
                >
                  Business
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/blogs"
                  className="nav-link p-0 text-white-50"
                  onClick={scrollToTop}
                >
                  Opinion
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold mb-3">Connect</h5>
            <ul className="nav flex-column">
              <li className="d-flex align-items-center mb-3">
                <i className="bi bi-envelope-fill me-2 text-primary"></i>
                <span className="text-white-50">contact@thepost.com</span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <i className="bi bi-geo-alt-fill me-2 text-primary"></i>
                <span className="text-white-50">Lahore,Punjab Pakistan</span>
              </li>
              <li className="d-flex align-items-center mb-4">
                <i className="bi bi-person-fill me-2 text-primary"></i>
                <Link
                  to="/contact"
                  className="text-white-50 text-decoration-none"
                >
                  Write for Us
                </Link>
              </li>
            </ul>
            <div className="social-links">
              <h6 className="mb-3">Follow The Post</h6>
              <div className="d-flex gap-3">
                <a href="#" className="text-white fs-5" aria-label="Twitter">
                  <i className="bi bi-twitter-x"></i>
                </a>
                <a href="#" className="text-white fs-5" aria-label="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-white fs-5" aria-label="Instagram">
                  <i className="bi bi-instagram"></i>
                </a>
                <a href="#" className="text-white fs-5" aria-label="LinkedIn">
                  <i className="bi bi-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="mb-3 mb-md-0">
            <p className="text-white-50 mb-0">
              &copy; {currentYear} The Post. All rights reserved. Developed by{" "}
              <a
                href="https://hamzasajid.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-decoration-none"
              >
                Hamza Sajid
              </a>
            </p>
          </div>
          <div className="d-flex gap-3">
            <Link
              to="/privacy"
              className="text-white-50 text-decoration-none"
              onClick={scrollToTop}
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-white-50 text-decoration-none"
              onClick={scrollToTop}
            >
              Terms
            </Link>
            <Link
              to="/cookies"
              className="text-white-50 text-decoration-none"
              onClick={scrollToTop}
            >
              Cookies
            </Link>
            <Link
              to="/contact"
              className="text-white-50 text-decoration-none"
              onClick={scrollToTop}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="btn btn-primary position-fixed end-0 bottom-0 me-4 mb-4 rounded-circle shadow-sm"
        style={{
          width: "45px",
          height: "45px",
          opacity: 0.9,
          transition: "opacity 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.9")}
        aria-label="Back to top"
      >
        <i className="bi bi-arrow-up"></i>
      </button>
    </footer>
  );
};

export default Footer;
