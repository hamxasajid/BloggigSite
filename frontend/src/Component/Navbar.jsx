import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthCon";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Collapse navbar after clicking a link
  const handleNavLinkClick = () => {
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      const bsCollapse = window.bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark px-3 shadow-sm"
      style={{ backgroundColor: "#343a40" }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/" onClick={handleNavLinkClick}>
          <img
            src="/ThePostLogo1.jpg"
            alt="The Post"
            style={{ width: "50px", borderRadius: "50%" }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/" onClick={handleNavLinkClick}>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/blogs"
                onClick={handleNavLinkClick}
              >
                Blogs
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/about"
                onClick={handleNavLinkClick}
              >
                About
              </Link>
            </li>
          </ul>

          <div className="d-flex">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-light dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Welcome, {user.username}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <li>
                    <Link
                      className="dropdown-item"
                      to={user.role === "admin" ? "/admin" : "/Userdashboard"}
                      onClick={handleNavLinkClick}
                    >
                      {user.role === "admin"
                        ? "Admin Dashboard"
                        : "User Dashboard"}
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-outline-light me-2"
                  onClick={handleNavLinkClick}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="btn btn-light"
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
