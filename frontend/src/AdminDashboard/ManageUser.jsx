import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import moment from "moment";
import {
  FaSearch,
  FaTrash,
  FaSpinner,
  FaFilter,
  FaCheckCircle,
  FaEye,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BiSolidUserBadge } from "react-icons/bi";
import Modal from "react-bootstrap/Modal";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const url = "https://bloggigsite-production.up.railway.app";
  const usersPerPage = 10;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}/api/users`);
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${url}/api/users/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete user.");
    }
  };

  const handleRoleUpdate = async (id) => {
    try {
      const userToUpdate = users.find((user) => user._id === id);

      if (userToUpdate.role === "Pending") {
        const confirmUpdate = window.confirm(
          `Are you sure you want to update the role of "${userToUpdate.username}" to "author"?`
        );

        if (!confirmUpdate) return;

        const updatedUser = { ...userToUpdate, role: "author" };

        await axios.put(`${url}/api/users/${id}`, updatedUser);

        setUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, role: "author" } : user
          )
        );
      } else {
        alert("User is not in pending status.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to update role.");
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(startIndex, startIndex + usersPerPage);
  }, [filteredUsers, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
      const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrent) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrent;
        endPage = currentPage + maxPagesAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button
            className="page-link"
            onClick={() => handlePageChange(i)}
            style={{ minWidth: "40px", textAlign: "center" }}
          >
            {i}
          </button>
        </li>
      );
    }

    return (
      <nav aria-label="User pagination">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <FiChevronLeft />
            </button>
          </li>
          {pages}
          <li
            className={`page-item ${
              currentPage === totalPages ? "disabled" : ""
            }`}
          >
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <FiChevronRight />
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return <span className="badge bg-danger">{role}</span>;
      case "author":
        return <span className="badge bg-success">{role}</span>;
      case "Pending":
        return <span className="badge bg-warning text-dark">{role}</span>;
      default:
        return <span className="badge bg-secondary">{role}</span>;
    }
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <FaSpinner className="fa-spin me-2 fs-3 text-primary" />
          <p className="mt-3 text-muted">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card shadow-sm border-0" style={{ maxWidth: "500px" }}>
          <div className="card-body p-4 text-center">
            <h5 className="text-danger mb-3">Error Loading Users</h5>
            <p className="mb-4">{error}</p>
            <button
              className="btn btn-primary px-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4">
        <h2 className="fw-bold mb-4 d-flex align-items-center">
          <BiSolidUserBadge className="me-2 text-primary" />
          User Management
        </h2>

        {/* Search and Filters */}
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <FaSearch className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by username or email..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="input-group">
                  <span className="input-group-text bg-white border-end-0">
                    <FaFilter className="text-muted" />
                  </span>
                  <select
                    className="form-select"
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Regular Users</option>
                    <option value="author">Authors</option>
                    <option value="admin">Admins</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-hover bg-white">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{getRoleBadge(user.role)}</td>
                  <td
                    className="text-end"
                    style={{
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    {user.role === "Pending" && (
                      <button
                        className="btn btn-sm btn-success me-2"
                        title="Approve"
                        onClick={() => handleRoleUpdate(user._id)}
                      >
                        <FaCheckCircle />
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      title="View"
                      onClick={() => openUserModal(user)}
                    >
                      <FaEye />
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      title="Delete"
                      onClick={() => handleDelete(user._id)}
                      disabled={user.role === "admin"}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {renderPagination()}

        <Modal show={showModal} onHide={closeUserModal} centered size="lg">
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="w-100 text-center">
              <h4 className="fw-bold text-dark">User Profile</h4>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="pt-0">
            {selectedUser ? (
              <div className="user-profile-container">
                {/* Profile Header */}
                <div className="profile-header text-center mb-4">
                  <div className="avatar-container position-relative mx-auto">
                    <img
                      src={
                        selectedUser.profilePicture ||
                        "https://th.bing.com/th/id/R.e94860c29ac0062dfe773f10b3ce45bf?rik=SCqlsHg1S8oFDA&pid=ImgRaw&r=0"
                      }
                      alt="Profile"
                      className="avatar-img rounded-circle shadow"
                    />
                    <div className="status-badge position-absolute bottom-0 end-0">
                      <span
                        className={`badge rounded-pill ${
                          selectedUser.isVerified
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {selectedUser.isVerified ? (
                          <>
                            <i className="bi bi-patch-check-fill me-1"></i>{" "}
                            Verified
                          </>
                        ) : (
                          "Unverified"
                        )}
                      </span>
                    </div>
                  </div>

                  <h3 className="fw-bold mt-3 mb-1">{selectedUser.username}</h3>

                  <div className="role-badge mb-3">
                    <span
                      className={`badge rounded-pill ${
                        selectedUser.role === "admin"
                          ? "bg-danger"
                          : selectedUser.role === "author"
                          ? "bg-primary"
                          : "bg-secondary"
                      } px-3 py-2`}
                    >
                      {selectedUser.role.charAt(0).toUpperCase() +
                        selectedUser.role.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="profile-details">
                  <div className="row g-3">
                    {/* Column 1 */}
                    <div className="col-md-6">
                      <div className="detail-card p-3 rounded-3 mb-3">
                        <h6 className="detail-label text-muted mb-1">Email</h6>
                        <p className="detail-value mb-0">
                          {selectedUser.email || (
                            <span className="text-muted fst-italic">
                              Not provided
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="detail-card p-3 rounded-3 mb-3">
                        <h6 className="detail-label text-muted mb-1">Phone</h6>
                        <p className="detail-value mb-0">
                          {selectedUser.phone || (
                            <span className="text-muted fst-italic">
                              Not provided
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="detail-card p-3 rounded-3 mb-3">
                        <h6 className="detail-label text-muted mb-1">
                          Education
                        </h6>
                        <p className="detail-value mb-0">
                          {selectedUser.education || (
                            <span className="text-muted fst-italic">
                              Not provided
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Column 2 */}
                    <div className="col-md-6">
                      <div className="detail-card p-3 rounded-3 mb-3">
                        <h6 className="detail-label text-muted mb-1">
                          Member Since
                        </h6>
                        <p className="detail-value mb-0">
                          {new Date(selectedUser.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>

                      <div className="detail-card p-3 rounded-3 mb-3">
                        <h6 className="detail-label text-muted mb-1">
                          Last Active
                        </h6>
                        <p className="detail-value mb-0">
                          {moment(selectedUser.lastActive).fromNow()}
                        </p>
                      </div>

                      <div className="detail-card p-3 rounded-3 mb-3">
                        <h6 className="detail-label text-muted mb-1">
                          User ID
                        </h6>
                        <p
                          className="detail-value mb-0 text-truncate"
                          title={selectedUser._id}
                        >
                          <small>{selectedUser._id}</small>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* About Section */}
                  <div className="detail-card p-3 rounded-3 mt-3">
                    <h6 className="detail-label text-muted mb-1">About</h6>
                    <p className="detail-value mb-0">
                      {selectedUser.about || (
                        <span className="text-muted fst-italic">
                          No bio provided
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer className="border-0">
            <button
              className="btn btn-outline-secondary rounded-pill px-4"
              onClick={closeUserModal}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default ManageUser;
