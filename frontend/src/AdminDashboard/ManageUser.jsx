import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  FaSearch,
  FaTrash,
  FaUserShield,
  FaUser,
  FaSpinner,
  FaFilter,
} from "react-icons/fa";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const url = "https://bloggigsite-production.up.railway.app";
  const usersPerPage = 10;

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}/api/users`);

        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          throw new Error("Invalid data format from server: Expected an array");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${url}/api/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Failed to delete user. Please try again.");
    }
  };

  // Handle Role Update (Toggle Pending to Author)
  const handleRoleUpdate = async (id) => {
    try {
      const userToUpdate = users.find((user) => user._id === id);
      if (userToUpdate.role === "Pending") {
        const updatedUser = { ...userToUpdate, role: "author" };
        await axios.put(`${url}/api/users/${id}`, updatedUser);
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, role: "author" } : user
          )
        );
      } else {
        alert("User is not in pending status.");
      }
    } catch (err) {
      console.error("Error updating role:", err);
      setError("Failed to update role. Please try again.");
    }
  };

  // Filter users based on search and role filter
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Pagination logic
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
          <button className="page-link" onClick={() => handlePageChange(i)}>
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

  if (loading) {
    return (
      <div className="container py-5 min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <FaSpinner className="fa-spin me-2" size={32} />
          <p className="mt-3">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5 min-vh-100 d-flex justify-content-center align-items-center">
        <div
          className="alert alert-danger text-center"
          style={{ maxWidth: "500px" }}
        >
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
          <button
            className="btn btn-outline-danger mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 min-vh-100">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">User Management</h2>
          </div>

          {/* Search and Filter Bar */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text bg-white">
                      <FaSearch />
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
                    <span className="input-group-text bg-white">
                      <FaFilter />
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
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="text-muted mb-0">
              Showing {currentUsers.length} of {filteredUsers.length} users
              {filteredUsers.length !== users.length &&
                ` (filtered from ${users.length} total)`}
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <h4 className="text-muted">
              No users found matching your criteria
            </h4>
            <button
              className="btn btn-outline-primary mt-3"
              onClick={() => {
                setSearchTerm("");
                setRoleFilter("all");
                setCurrentPage(1);
              }}
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={user.role === "Pending" ? "table-warning" : ""}
                  >
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDelete(user._id)}
                      >
                        <FaTrash />
                      </button>
                      {user.role === "Pending" && (
                        <button
                          className="btn btn-outline-warning ms-2"
                          onClick={() => handleRoleUpdate(user._id)}
                        >
                          <i className="bi bi-pencil me-1"></i> Update Role
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {renderPagination()}
        </>
      )}
    </div>
  );
};

export default ManageUser;
