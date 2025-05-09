import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const url = "https://bloggigsite-production.up.railway.app";

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${url}/api/users`);
        console.log("Fetched users:", res.data);

        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          throw new Error("Invalid data format from server: Expected an array");
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle Delete
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <div className="container py-5 min-vh-100">
      <h2 className="mb-4 text-center">Manage Users</h2>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <p className="text-danger text-center">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-center">No users found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) => user.role !== "admin")
                .map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge bg-secondary">{user.role}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUser;
