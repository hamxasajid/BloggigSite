import React from "react";

const Footer = () => {
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-dark text-light pt-5 pb-4 position-relative">
      <div className="container">
        <div className="row">
          {/* Blog Info */}
          <div className="col-md-3 mb-4">
            <h5>React Blog</h5>
            <p>
              Your go-to place for insightful articles on web development and
              more.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-3 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-light text-decoration-none">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-light text-decoration-none">
                  About
                </a>
              </li>
              <li>
                <a href="#posts" className="text-light text-decoration-none">
                  Posts
                </a>
              </li>
              <li>
                <a href="/contact" className="text-light text-decoration-none">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-md-3 mb-4">
            <h5>Categories</h5>
            <ul className="list-unstyled">
              <li>
                <a href="#" className="text-light text-decoration-none">
                  Frontend
                </a>
              </li>
              <li>
                <a href="#" className="text-light text-decoration-none">
                  Backend
                </a>
              </li>
              <li>
                <a href="#" className="text-light text-decoration-none">
                  DevOps
                </a>
              </li>
              <li>
                <a href="#" className="text-light text-decoration-none">
                  UI/UX
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-md-3 mb-4">
            <h5>Follow Us</h5>
            <div className="d-flex gap-3">
              <a href="#" className="text-light fs-5">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-light fs-5">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="text-light fs-5">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-light fs-5">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-secondary" />
        <p className="text-center mb-0">
          &copy; {new Date().getFullYear()} React Blog. All rights reserved.
        </p>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className="btn btn-primary position-absolute end-0 bottom-0 me-3 mb-3 rounded-circle"
        style={{ width: "40px", height: "40px" }}
        aria-label="Back to top"
      >
        <i className="bi bi-arrow-up"></i>
      </button>
    </footer>
  );
};

export default Footer;
