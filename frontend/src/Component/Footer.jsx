import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowUp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUserEdit,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLinkClick = () => {
    setTimeout(scrollToTop, 100);
  };

  useEffect(() => {
    const handleScroll = () => {
      const tenVh = window.innerHeight * 0.1;
      if (window.scrollY > tenVh) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    // Add debounce to optimize performance
    const debouncedScroll = () => {
      window.requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", debouncedScroll);
    return () => window.removeEventListener("scroll", debouncedScroll);
  }, []);

  return (
    <footer className="bg-dark text-white pt-5 pb-4 position-relative">
      <div className="container">
        <div className="row g-4">
          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <div className="d-flex flex-column h-100">
              <h5 className="fw-bold mb-3 text-white">The Post</h5>
              <p className="mb-4 same-color">
                A Platform for Curious Minds, Where Ideas Unfold. Discover
                thought-provoking content on technology, science, and modern
                culture.
              </p>
              <div className="mt-auto">
                <h6 className="mb-3 text-white">Stay Updated</h6>
                <div className="input-group mb-3">
                  <input
                    type="email"
                    className="form-control bg-dark text-white border-secondary"
                    placeholder="Your email address"
                    aria-label="Email"
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    style={{ minWidth: "100px" }}
                  >
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3 text-white">Explore</h5>
            <ul className="nav flex-column footer-links">
              <li className="nav-item mb-2">
                <Link
                  to="/"
                  className="nav-link p-0 text-muted"
                  onClick={handleLinkClick}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/blogs"
                  className="nav-link p-0 text-muted"
                  onClick={handleLinkClick}
                >
                  All Posts
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/popular"
                  className="nav-link p-0 text-muted"
                  onClick={handleLinkClick}
                >
                  Popular
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/authors"
                  className="nav-link p-0 text-muted"
                  onClick={handleLinkClick}
                >
                  Authors
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/about"
                  className="nav-link p-0 text-muted"
                  onClick={handleLinkClick}
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-lg-2 col-md-6">
            <h5 className="fw-bold mb-3 text-white">Topics</h5>
            <ul className="nav flex-column footer-links">
              <li className="nav-item mb-2">
                <Link
                  to="/blogs"
                  className="nav-link p-0 text-muted"
                  onClick={handleLinkClick}
                >
                  Technology
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/blogs"
                  className="nav-link p-0 text-muted"
                  onClick={handleLinkClick}
                >
                  Science
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/blogs"
                  className="nav-link p-0 text-muted"
                  onClick={handleLinkClick}
                >
                  Culture
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/blogs"
                  className="nav-link p-0 text-muted"
                  onClick={handleLinkClick}
                >
                  Business
                </Link>
              </li>
              <li className="nav-item mb-2">
                <Link
                  to="/blogs"
                  className="nav-link p-0 text-muted"
                  onClick={handleLinkClick}
                >
                  Opinion
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-lg-4 col-md-6">
            <h5 className="fw-bold mb-3 text-white">Connect</h5>
            <ul className="nav flex-column mb-4">
              <li className="d-flex align-items-center mb-3">
                <FaEnvelope className="text-primary me-2" />
                <span className="same-color">contact@thepost.com</span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <FaMapMarkerAlt className="text-primary me-2" />
                <span className="same-color">Lahore, Punjab Pakistan</span>
              </li>
              <li className="d-flex align-items-center mb-4">
                <FaUserEdit className="text-primary me-2" />
                <Link
                  to="/contact"
                  className="same-color text-decoration-none"
                  onClick={handleLinkClick}
                >
                  Write for Us
                </Link>
              </li>
            </ul>
            <div className="social-links">
              <h6 className="mb-3 text-white">Follow The Post</h6>
              <div className="d-flex gap-3">
                <a href="#" className="text-white fs-5" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="#" className="text-white fs-5" aria-label="Facebook">
                  <FaFacebook />
                </a>
                <a href="#" className="text-white fs-5" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="#" className="text-white fs-5" aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4 border-secondary" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="mb-3 mb-md-0">
            <p className="same-color mb-0 text-center text-md-start">
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
          <div className="d-flex gap-3 text-center text-md-end">
            {["Privacy", "Terms", "Cookies", "Contact"].map((item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className="same-color text-decoration-none"
                onClick={handleLinkClick}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className={`scroll-top-btn ${showScrollButton ? "visible" : ""}`}
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </button>
      )}
    </footer>
  );
};

export default Footer;
