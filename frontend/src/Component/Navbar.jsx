import React, { useContext, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthCon";
import Swal from "sweetalert2";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaBook,
  FaInfoCircle,
  FaBars,
} from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const offcanvasRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (user?.profilePicture) {
      setProfilePic(user.profilePicture);
    }
  }, [user]);

  const handleNavLinkClick = () => {
    // Close offcanvas menu if open
    if (offcanvasRef.current?.classList.contains("show")) {
      const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(
        offcanvasRef.current
      );
      bsOffcanvas.hide();
    }

    // Scroll to top after navigation
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
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
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  };

  return (
    <>
      {/* Main Navbar */}
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

          {/* Desktop Navigation - Visible on lg screens and up */}
          <div className="d-none d-lg-flex align-items-center gap-4">
            <div className="d-flex gap-3">
              <Link
                className="nav-link text-dark fw-medium"
                to="/"
                onClick={handleNavLinkClick}
              >
                Home
              </Link>
              <Link
                className="nav-link text-dark fw-medium"
                to="/blogs"
                onClick={handleNavLinkClick}
              >
                Blogs
              </Link>
              <Link
                className="nav-link text-dark fw-medium"
                to="/about"
                onClick={handleNavLinkClick}
              >
                About
              </Link>
            </div>

            {user ? (
              <div className="dropdown ms-3">
                <button
                  className="btn btn-light rounded-pill dropdown-toggle d-flex align-items-center gap-2 px-3 py-2"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {profilePic ? (
                    <img
                      src={profilePic}
                      alt={user.username}
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <FaUserCircle size={32} className="text-primary" />
                  )}
                  <span>{user.username}</span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow border-0 mt-2"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <Link
                      className="dropdown-item d-flex align-items-center gap-2 py-2"
                      to={user.role === "admin" ? "/admin" : "/Userdashboard"}
                      onClick={handleNavLinkClick}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        className="text-primary"
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
                    <hr className="dropdown-divider my-1" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2 py-2 text-danger"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt size={16} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2 ms-3">
                <Link
                  to="/login"
                  className="btn btn-outline-primary rounded-pill px-3"
                  onClick={handleNavLinkClick}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-primary rounded-pill px-3"
                  onClick={handleNavLinkClick}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle Button - Hidden on lg screens and up */}
          <button
            ref={toggleBtnRef}
            className="navbar-toggler border-0 d-lg-none no-focus-outline"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
          >
            <FaBars size={24} className="text-dark" />
          </button>
        </div>
      </nav>

      {/* Offcanvas Menu for Mobile */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasNavbar"
        aria-labelledby="offcanvasNavbarLabel"
        ref={offcanvasRef}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold" id="offcanvasNavbarLabel">
            Menu
          </h5>
          <button
            type="button"
            className="btn-close no-focus-outline"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav mb-4">
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-3 py-3"
                to="/"
                onClick={handleNavLinkClick}
              >
                <FaHome size={18} className="text-primary" />
                <span>Home</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-3 py-3"
                to="/blogs"
                onClick={handleNavLinkClick}
              >
                <FaBook size={18} className="text-primary" />
                <span>Blogs</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link d-flex align-items-center gap-3 py-3"
                to="/about"
                onClick={handleNavLinkClick}
              >
                <FaInfoCircle size={18} className="text-primary" />
                <span>About</span>
              </Link>
            </li>
          </ul>

          {user ? (
            <div className="border-top pt-3">
              <div className="d-flex align-items-center gap-3 mb-4">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <FaUserCircle size={32} className="text-primary" />
                )}
                <div>
                  <h6 className="mb-0 fw-bold">
                    <span>{user?.username || "User"}</span>
                  </h6>
                  <small className="text-muted">
                    {user.role.toLowerCase() === "pending"
                      ? "User (Request to Author Pending)."
                      : user.role.toUpperCase()}
                  </small>
                </div>
              </div>

              <Link
                className="btn btn-outline-primary w-100 mb-2 d-flex align-items-center justify-content-center gap-2"
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
                {user.role === "admin" ? "Admin Dashboard" : "My Dashboard"}
              </Link>

              <button
                className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={handleLogout}
              >
                <FaSignOutAlt size={16} />
                Logout
              </button>
            </div>
          ) : (
            <div className="border-top pt-3">
              <Link
                to="/login"
                className="btn btn-outline-primary w-100 mb-3"
                onClick={handleNavLinkClick}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary w-100"
                onClick={handleNavLinkClick}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
