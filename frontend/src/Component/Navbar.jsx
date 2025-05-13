import React, { useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthCon";
import "./Navbar.css";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaBook,
  FaInfoCircle,
} from "react-icons/fa";
import Swal from "sweetalert2";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const navbarCollapseRef = useRef(null);

  const handleNavLinkClick = () => {
    if (
      navbarCollapseRef.current &&
      navbarCollapseRef.current.classList.contains("show")
    ) {
      const bsCollapse = new window.bootstrap.Collapse(
        navbarCollapseRef.current,
        {
          toggle: false,
        }
      );
      bsCollapse.hide();
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Logout Confirmation",
      text: "Are you sure you want to log out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3b82f6",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, logout",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        navigate("/login");
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Brand Logo */}
        <Link className="navbar-brand" to="/" onClick={handleNavLinkClick}>
          <div className="d-flex align-items-center">
            <img
              src="/ThePostLogo1.jpg"
              alt="The Post"
              className="rounded-circle me-2"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <span className="fw-bold text-primary">ThePost</span>
          </div>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div
          className="collapse navbar-collapse"
          id="navbarContent"
          ref={navbarCollapseRef}
        >
          {/* Left-aligned Navigation */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-2"
                to="/"
                onClick={handleNavLinkClick}
              >
                <FaHome size={16} />
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-2"
                to="/blogs"
                onClick={handleNavLinkClick}
              >
                <FaBook size={16} />
                Blogs
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-2"
                to="/about"
                onClick={handleNavLinkClick}
              >
                <FaInfoCircle size={16} />
                About
              </Link>
            </li>
          </ul>

          {/* Right-aligned User Controls */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-primary dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUserCircle size={20} />
                  <span className="d-none d-md-inline">{user.username}</span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-sm"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-2"
                      to={user.role === "admin" ? "/admin" : "/Userdashboard"}
                      onClick={handleNavLinkClick}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L7.547 9.31a.91.91 0 1 0 1.302 1.258l3.434-4.297a.389.389 0 0 0-.029-.518z" />
                        <path
                          fillRule="evenodd"
                          d="M0 10a8 8 0 1 1 15.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 0 1 0 10zm8-7a7 7 0 0 0-6.603 9.329c.203.575.923.876 1.68.63C4.397 12.533 6.358 12 8 12s3.604.532 4.923.96c.757.245 1.477-.056 1.68-.631A7 7 0 0 0 8 3z"
                        />
                      </svg>
                      {user.role === "admin"
                        ? "Admin Dashboard"
                        : "My Dashboard"}
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 text-danger"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt size={16} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-primary"
                  onClick={handleNavLinkClick}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary"
                  onClick={handleNavLinkClick}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
