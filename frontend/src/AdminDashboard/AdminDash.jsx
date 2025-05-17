import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import {
  FaUsers,
  FaBlog,
  FaUserClock,
  FaEnvelope,
  FaSpinner,
  FaUserShield,
  FaChartLine,
  FaEdit,
} from "react-icons/fa";
import { BsGraphUp } from "react-icons/bs";

const AdminDash = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalBlogs: 0,
    regesterUsersLastSevenDays: 0,
    publishBlogsLastSevenDays: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [newAuthorRequestCount, setNewAuthorRequestCount] = useState(0);
  const navigate = useNavigate();

  const url = "https://bloggigsite-production.up.railway.app";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === "admin") {
        setAdminData(parsedUser);
        fetchStats();
        fetchNewMessagesCount();
        fetchNewAuthorRequestCount();
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
    setLoading(false);
  }, [navigate]);

  const fetchNewMessagesCount = async () => {
    try {
      const response = await axios.get(`${url}/contact-data`);
      const newMessages = response.data.filter(
        (msg) => msg.status === "new" || !msg.status
      );
      setNewMessagesCount(newMessages.length);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchNewAuthorRequestCount = async () => {
    try {
      const response = await axios.get(`${url}/api/users`);
      const newAuthorRequests = response.data.filter(
        (user) => user.role === "Pending"
      );
      setNewAuthorRequestCount(newAuthorRequests.length);
    } catch (error) {
      console.error("Error fetching author requests:", error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        axios.post(`${url}/update-last-active`, {
          userId: user._id,
        });
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);

      const [usersRes, blogsRes] = await Promise.all([
        axios.get(`${url}/api/users`),
        axios.get(`${url}/api/blogs`),
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

      const twoMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const activeUsersRes = await axios.get(`${url}/active-users`, {
        params: { lastActive: twoMinutesAgo.toISOString() },
      });
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
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <FaSpinner className="fa-spin me-2 fs-3 text-primary" />
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-3 py-md-4">
        {/* Header Section */}
        <div className="row mb-3 mb-md-4">
          <div className="col-12">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-3">
              <div className="text-center text-md-start">
                <h2 className="fw-bold mb-1 d-flex align-items-center justify-content-center justify-content-md-start">
                  <FaUserShield className="me-2 text-primary" />
                  Admin Dashboard
                </h2>
                <p className="text-muted mb-0">
                  Welcome back,{" "}
                  <span className="fw-medium">{adminData?.username}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="row g-2 g-md-3 mb-3 mb-md-4 ">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            loading={statsLoading}
            trend={stats.regesterUsersLastSevenDays}
            trendLabel="last 7 days"
            icon={<FaUsers className="text-primary" />}
            color="primary"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            loading={statsLoading}
            trendLabel="last 10 mins"
            icon={<FaUserClock className="text-success" />}
            color="success"
          />
          <StatCard
            title="Total Blogs"
            value={stats.totalBlogs}
            loading={statsLoading}
            trend={stats.publishBlogsLastSevenDays}
            trendLabel="last 7 days"
            icon={<FaBlog className="text-info" />}
            color="info"
          />
        </div>

        {/* Quick Actions Section */}
        <div className="row mb-3 mb-md-4">
          <div className="col-12">
            <h5 className="fw-bold mb-3 d-flex align-items-center">
              <BsGraphUp className="me-2 text-secondary" />
              Quick Actions
            </h5>
          </div>
          <div className="col-6 col-md-6 col-lg-3 mb-2 mb-md-3">
            <ActionCard
              title="Manage Blogs"
              description="Manage all blog "
              icon={<FaBlog className="text-primary" />}
              link="/Admindashboard/viewallblogs"
              color="primary"
            />
          </div>
          <div className="col-6 col-md-6 col-lg-3 mb-2 mb-md-3">
            <ActionCard
              title="Manage Users"
              description="Manage accounts"
              icon={<FaUsers className="text-danger" />}
              link="/Admindashboard/manageusers"
              color="danger"
              badge={newAuthorRequestCount}
            />
          </div>
          <div className="col-6 col-md-6 col-lg-3 mb-2 mb-md-3">
            <ActionCard
              title="Messages"
              description="Manage messages"
              icon={<FaEnvelope className="text-warning" />}
              link="/Admindashboard/messages"
              color="warning"
              badge={newMessagesCount}
            />
          </div>
          <div className="col-6 col-md-6 col-lg-3 mb-2 mb-md-3">
            <ActionCard
              title="Analytics"
              description="View site analytics"
              icon={<FaChartLine className="text-success" />}
              link="/Admindashboard/analytics"
              color="success"
            />
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h5 className="card-title fw-bold d-flex align-items-center">
                  <FaEdit className="me-2 text-secondary" />
                  Recent Activity
                </h5>
                <div className="alert alert-info border-0 bg-opacity-10 mb-0">
                  <div className="d-flex align-items-center">
                    <FaChartLine className="me-2 me-md-3 text-info" size={20} />
                    <div>
                      <p className="mb-0 small">
                        Activity dashboard coming soon! Track recent admin
                        actions and system events.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  loading,
  trend,
  trendLabel,
  icon,
  color,
}) => {
  return (
    <div className="col-12 col-md-4">
      <div
        className={`card border-0 shadow-sm border-start border-3 border-${color} h-100`}
      >
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="text-muted mb-2 small">{title}</h6>
              {loading ? (
                <div
                  className="d-flex align-items-center"
                  style={{ height: "38px" }}
                >
                  <FaSpinner className="fa-spin text-muted" />
                </div>
              ) : (
                <h3 className="mb-0 fw-bold">{value}</h3>
              )}
            </div>
            <div className={`icon-circle bg-${color}-light text-${color}`}>
              {icon}
            </div>
          </div>
          {trend !== undefined && (
            <div className="mt-2">
              <small
                className={`text-${trend > 0 ? "success" : "muted"} fw-medium`}
              >
                {trend > 0 ? `+${trend}` : "No new"} {trendLabel}
              </small>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ title, description, icon, link, color, badge }) => {
  return (
    <div
      className={`card border-0 shadow-sm hover-lift hover-shadow transition-all h-100 py-3 py-md-4`}
    >
      <div className="card-body text-center p-3">
        {badge > 0 && (
          <span
            className={`position-absolute top-20 end-0 translate-middle badge rounded-pill bg-${color}`}
            style={{ transform: "translate(30%, -30%)" }}
          >
            {badge}
          </span>
        )}
        <div
          className={`icon-circle-lg bg-${color}-light text-${color} mb-2 mx-auto`}
        >
          {icon}
        </div>
        <h5 className="h6 mb-1">{title}</h5>
        <p className="text-muted small mb-2 h-25 text-truncate">
          {description}
        </p>
        <a href={link} className={`btn btn-sm btn-${color} stretched-link`}>
          {title}
        </a>
      </div>
    </div>
  );
};

export default AdminDash;
