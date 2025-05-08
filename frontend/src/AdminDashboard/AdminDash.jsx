import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaBlog, FaUserClock } from "react-icons/fa";

const AdminDash = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBlogs: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === "admin") {
        setAdminData(parsedUser);
        fetchStats();
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        axios.post("http://localhost:5000/update-last-active", {
          userId: user._id,
        });
      }
    }, 5 * 60 * 1000); // Update every 5 minutes

    return () => clearInterval(intervalId);
  }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);

      const [usersRes, blogsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users"),
        axios.get("http://localhost:5000/api/blogs"),
      ]);

      const totalUsers = usersRes.data.length;
      const regesterUsersLastSevenDays = usersRes.data.filter((user) => {
        const createdAt = new Date(user.createdAt);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return createdAt >= sevenDaysAgo;
      }).length;
      const totalBlogs = blogsRes.data.length;
      const publishBlogsLastSevenDays = blogsRes.data.filter((blog) => {
        const createdAt = new Date(blog.createdAt);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return createdAt >= sevenDaysAgo;
      }).length;

      // Find users active in the last 10 minutes
      const twoMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const activeUsersRes = await axios.get(
        "http://localhost:5000/active-users",
        {
          params: { lastActive: twoMinutesAgo.toISOString() },
        }
      );
      const activeUsers = activeUsersRes.data.count;

      setStats({
        totalUsers,
        activeUsers,
        totalBlogs,
        regesterUsersLastSevenDays,
        publishBlogsLastSevenDays,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        totalBlogs: 0,
      });
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5 min-vh-100">
      <div className="mb-4 text-center">
        <h2 className="fw-bold">Admin Dashboard</h2>
        <p className="text-muted">Welcome back, {adminData?.username}</p>
      </div>

      {/* Profile Card */}
      <div className="card mb-4 shadow-sm border-0">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "#1C45C1",
                color: "#fff",
                fontSize: "20px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "15px",
              }}
            >
              {adminData?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h5 className="mb-0">{adminData?.username}</h5>
              {adminData?.email && (
                <small className="text-muted d-block">{adminData.email}</small>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="row mb-4 g-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          loading={statsLoading}
          color={stats.totalUsers > 0 ? "success" : "danger"}
          icon={<FaUsers size={24} />}
          helpText={
            stats.regesterUsersLastSevenDays > 0
              ? "+" + stats.regesterUsersLastSevenDays + " Users in last 7 days"
              : "No new users in last 7 days"
          }
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          loading={statsLoading}
          color={stats.activeUsers > 0 ? "success" : "danger"}
          icon={<FaUserClock size={24} />}
          helpText="Active in last 10 minutes"
        />
        <StatCard
          title="Total Blogs"
          value={stats.totalBlogs}
          loading={statsLoading}
          color={stats.totalBlogs > 0 ? "success" : "danger"}
          icon={<FaBlog size={24} />}
          helpText={
            stats.publishBlogsLastSevenDays > 0
              ? "+" + stats.publishBlogsLastSevenDays + " Blogs in last 7 days"
              : "No new blogs in last 7 days"
          }
        />
      </div>

      {/* Dashboard Panels */}
      <div className="row g-4">
        <DashboardCard
          title="Manage All Blogs"
          desc="View, edit, and delete users' blog posts."
          link="/Admindashboard/viewallblogs"
          color="primary"
          icon={<FaBlog className="me-2" />}
        />
        <DashboardCard
          title="Manage Users"
          desc="Control access and update user info."
          link="/Admindashboard/manageusers"
          color="danger"
          icon={<FaUsers className="me-2" />}
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, loading, color, icon, helpText }) => (
  <div className="col-md-4">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body text-center">
        <div className={`text-${color} mb-2`}>{icon}</div>
        <h5 className="card-title text-muted">{title}</h5>
        {loading ? (
          <div
            className={`spinner-border spinner-border-sm text-${color}`}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          <h2 className={`fw-bold text-${color}`}>{value}</h2>
        )}
        <small className={`text-${value > 0 ? "muted" : "danger"}`}>
          {helpText}
        </small>
      </div>
    </div>
  </div>
);

const DashboardCard = ({ title, desc, link, color, icon }) => (
  <div className="col-md-6 col-lg-4">
    <div className="card h-100 border-0 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">
          {icon}
          {title}
        </h5>
        <p className="card-text">{desc}</p>
        <a href={link} className={`btn btn-${color} w-100`}>
          Go to {title}
        </a>
      </div>
    </div>
  </div>
);

export default AdminDash;
