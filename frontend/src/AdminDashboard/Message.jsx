import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaTrash,
  FaReply,
  FaSync,
} from "react-icons/fa";
import emailjs from "@emailjs/browser";

const MessageDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const url = "https://bloggigsite-production.up.railway.app";

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get(`${url}/contact-data`);
      setMessages(data);
    } catch (err) {
      console.error("Failed to fetch messages", err);
      setError(err.response?.data?.error || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  // Toggle message read status
  const toggleReadStatus = async (id, currentStatus) => {
    try {
      await axios.patch(`${url}/contact-data/${id}`, {
        status: currentStatus === "read" ? "unread" : "read",
      });
      fetchMessages();
    } catch (err) {
      console.error("Failed to update status", err);
      setError("Failed to update message status");
    }
  };

  // Delete a message
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await axios.delete(`${url}/contact-data/${id}`);
        fetchMessages();
      } catch (err) {
        console.error("Failed to delete message", err);
        setError("Failed to delete message");
      }
    }
  };

  // Send official reply from connect.thepost@gmail.com
  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setSendingReply(true);

    try {
      // Send email via EmailJS
      await emailjs.send(
        "service_z3hby28",
        "template_opgftnc",
        {
          to_name: replyingTo.name,
          original_subject: replyingTo.subject,
          reply_message: replyContent,
          original_message: replyingTo.message,
          from_name: "The Post Team",
          from_email: "connect.thepost@gmail.com",
          to_email: replyingTo.email,
          subject: `Re: ${replyingTo.subject}`,
        },
        "ypG_93Enakfn2cUf4"
      );

      // Update message status to "replied"
      await axios.patch(`${url}/contact-data/${replyingTo.id}`, {
        status: "replied",
      });

      // Reset form and refresh messages
      setReplyingTo(null);
      setReplyContent("");
      fetchMessages();

      alert("Reply sent successfully from connect.thepost@gmail.com");
    } catch (err) {
      console.error("Failed to send reply", err);
      setError("Failed to send reply. Please try again.");
    } finally {
      setSendingReply(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    emailjs.init("tksCvjtmdoFXZ21AE");
  }, []);

  return (
    <div className="container py-5 min-vh-100">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2">Contact Messages</h1>
        <button
          onClick={fetchMessages}
          className="btn btn-outline-primary d-flex align-items-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <>
              <FaSync className="spin" />
              Refreshing...
            </>
          ) : (
            <>
              <FaSync />
              Refresh
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-danger mb-4 d-flex justify-content-between align-items-center">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          />
        </div>
      )}

      {/* Reply Modal */}
      {replyingTo && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header bg-light p-3">
                <h5 className="modal-title text-dark fs-5 fw-semibold">
                  Reply to {replyingTo.name}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setReplyingTo(null)}
                  disabled={sendingReply}
                />
              </div>
              <form onSubmit={handleReplySubmit}>
                <div className="modal-body p-4">
                  {/* From Field */}
                  <div className="mb-3">
                    <label className="form-label text-muted">From</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value="connect.thepost@gmail.com"
                      readOnly
                    />
                  </div>

                  {/* To Field */}
                  <div className="mb-3">
                    <label className="form-label text-muted">To</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={replyingTo.email}
                      readOnly
                    />
                  </div>

                  {/* Subject Field */}
                  <div className="mb-3">
                    <label className="form-label text-muted">Subject</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={`Re: ${replyingTo.subject}`}
                      readOnly
                    />
                  </div>

                  {/* Reply Message */}
                  <div className="mb-4">
                    <label className="form-label text-muted">Your Reply</label>
                    <textarea
                      className="form-control form-control-sm"
                      rows={3}
                      onResize={false}
                      style={{ resize: "none" }}
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Type your reply here..."
                      required
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer bg-light p-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => setReplyingTo(null)}
                    disabled={sendingReply}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-sm"
                    disabled={sendingReply}
                  >
                    {sendingReply ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Sending...
                      </>
                    ) : (
                      "Send Reply"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="alert alert-info">No messages found</div>
      ) : (
        <div className="row g-4">
          {messages.map((message) => (
            <div key={message._id} className="col-md-6 col-lg-4">
              <div
                className={`card h-100 shadow-sm ${
                  message.status === "unread"
                    ? "border-primary border-2"
                    : message.status === "replied"
                    ? "border-success border-2"
                    : ""
                }`}
              >
                <div
                  className={`card-header ${
                    message.status === "unread"
                      ? "bg-primary text-white"
                      : message.status === "replied"
                      ? "bg-success text-white"
                      : "bg-light"
                  }`}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{message.name}</h5>
                    <span
                      className={`badge rounded-pill ${
                        message.status === "replied"
                          ? "bg-light text-success"
                          : message.status === "read"
                          ? "bg-secondary"
                          : "bg-light text-primary"
                      }`}
                    >
                      {message.status || "unread"}
                    </span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <h6 className="text-muted small">Email</h6>
                    <a
                      href={`mailto:${message.email}`}
                      className="text-decoration-none"
                    >
                      {message.email}
                    </a>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-muted small">Subject</h6>
                    <p className="fw-semibold">
                      {message.subject || "No subject"}
                    </p>
                  </div>
                  <div className="mb-3">
                    <h6 className="text-muted small">Message</h6>
                    <p className="card-text">{message.message}</p>
                  </div>
                  <div className="text-muted small">
                    {format(new Date(message.createdAt), "MMM dd, yyyy h:mm a")}
                  </div>
                </div>
                <div className="card-footer bg-transparent">
                  <div className="d-flex justify-content-between">
                    <button
                      onClick={() =>
                        setReplyingTo({
                          id: message._id,
                          name: message.name,
                          email: message.email,
                          subject: message.subject,
                          message: message.message,
                        })
                      }
                      className="btn btn-sm btn-success"
                    >
                      <FaReply className="me-1" />
                      Reply
                    </button>
                    <div>
                      <button
                        onClick={() =>
                          toggleReadStatus(message._id, message.status)
                        }
                        className="btn btn-sm btn-outline-secondary me-2"
                        title={
                          message.status === "read"
                            ? "Mark as unread"
                            : "Mark as read"
                        }
                      >
                        {message.status === "read" ? (
                          <FaEnvelope />
                        ) : (
                          <FaEnvelopeOpen />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(message._id)}
                        className="btn btn-sm btn-outline-danger"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1040;
          width: 100vw;
          height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default MessageDashboard;
