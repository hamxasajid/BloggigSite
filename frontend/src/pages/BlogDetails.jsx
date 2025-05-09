import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  FaCalendarAlt,
  FaClock,
  FaComment,
  FaArrowLeft,
  FaUser,
  FaPaperPlane,
  FaThumbsUp,
  FaRegThumbsUp,
  FaChevronLeft,
  FaChevronRight,
  FaReply,
  FaRegComment,
} from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { FiTag } from "react-icons/fi";
import "./BlogDetails.css";

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const url = "https://bloggigsite-production.up.railway.app";

  const COMMENTS_PER_PAGE = 3;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const blogRes = await axios.get(`${url}/api/blogs/${id}`);
        setBlog(blogRes.data);
        setLikes(blogRes.data.likes || 0);

        if (blogRes.data.allowComments) {
          const commentsRes = await axios.get(
            `${url}/api/blogs/${id}/comments`
          );
          setComments(commentsRes.data);
        }

        const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
        setHasLiked(likedPosts.includes(id));
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to fetch blog post"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedInUser);
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const response = await axios.post(`${url}/api/blogs/${id}/comments`, {
        name: user.username,
        email: user.email,
        text: newComment,
        isReply: false,
      });
      setComments([response.data, ...comments]);
      setNewComment("");
      setCurrentPage(1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit comment");
    }
  };

  const handleReplySubmit = async (parentCommentId) => {
    if (!replyContent.trim()) return;

    try {
      const response = await axios.post(
        `${url}/api/blogs/${id}/comments/${parentCommentId}/replies`,
        {
          name: user.username,
          email: user.email,
          text: replyContent,
        }
      );

      setComments(
        comments.map((comment) => {
          if (comment._id === parentCommentId) {
            return {
              ...comment,
              replies: [...(comment.replies || []), response.data],
            };
          }
          return comment;
        })
      );

      setReplyContent("");
      setReplyingTo(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit reply");
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      const response = await axios.post(
        `${url}/api/blogs/${id}/comments/${commentId}/like`,
        {
          userId: user._id, // ✅ Send userId here
        }
      );

      setComments(
        comments.map((comment) => {
          if (comment._id === commentId) {
            return {
              ...comment,
              likes: response.data.likes,
              likedBy: response.data.likedBy,
            };
          }
          if (comment.replies) {
            const updatedReplies = comment.replies.map((reply) => {
              if (reply._id === commentId) {
                return {
                  ...reply,
                  likes: response.data.likes,
                  likedBy: response.data.likedBy,
                };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        })
      );
    } catch (err) {
      console.error("Like error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to like comment");
    }
  };

  const handleLikeToggle = async () => {
    try {
      const newHasLiked = !hasLiked;
      const action = newHasLiked ? "like" : "unlike";

      setHasLiked(newHasLiked);
      setLikes(newHasLiked ? likes + 1 : likes - 1);

      let likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
      if (newHasLiked) {
        if (!likedPosts.includes(id)) {
          likedPosts.push(id);
        }
      } else {
        likedPosts = likedPosts.filter((postId) => postId !== id);
      }
      localStorage.setItem("likedPosts", JSON.stringify(likedPosts));

      await axios.post(`${url}/api/blogs/${id}/like`, {
        action: action,
      });
    } catch {
      setHasLiked(!hasLiked);
      setLikes(hasLiked ? likes - 1 : likes + 1);
      setError("Failed to update like status");
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCommentDate = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const startIndex = (currentPage - 1) * COMMENTS_PER_PAGE;
  const visibleComments = comments.slice(
    startIndex,
    startIndex + COMMENTS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const isCommentLikedByUser = (comment) => {
    return comment.likedBy && user && comment.likedBy.includes(user._id);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger">{error}</div>
        <Link to="/blogs" className="btn btn-primary">
          Back to Blogs
        </Link>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="error-container">
        <div className="alert alert-warning">Blog post not found</div>
        <Link to="/blogs" className="btn btn-primary">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-details-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="back-button-container"></div>

            <article className="blog-card">
              <div className="cover-image-container">
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    flexShrink: 0,
                    borderRadius: "8px",
                  }}
                />
              </div>

              <div className="blog-header">
                <div className="meta-info">
                  <span className={`status-badge ${blog.status}`}>
                    {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                  </span>
                  <span className="meta-item">
                    <FaCalendarAlt className="icon" />
                    {formatDate(blog.createdAt)}
                  </span>
                  <span className="meta-item">
                    <FaClock className="icon" />
                    {blog.readTime} min read
                  </span>
                  {blog.allowComments && (
                    <span className="meta-item">
                      <FaComment className="icon" />
                      {comments.length} comments
                    </span>
                  )}
                </div>

                <h1 className="blog-title">{blog.title}</h1>

                <div className="tags-container">
                  <span className="category-badge">
                    <BiCategory className="icon" />
                    {blog.category}
                  </span>
                  {blog.tags &&
                    blog.tags.map((tag, index) => (
                      <span key={index} className="tag-badge">
                        <FiTag className="icon" />
                        {tag}
                      </span>
                    ))}
                </div>
              </div>

              <div className="blog-content">
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
              </div>

              <div className="like-section">
                <button
                  className={`like-button ${hasLiked ? "liked" : ""}`}
                  onClick={handleLikeToggle}
                >
                  {hasLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
                  <span>
                    {likes} {likes === 1 ? "Like" : "Likes"}
                  </span>
                </button>
              </div>
            </article>

            {blog.allowComments && user && (
              <div className="comments-section">
                <h3 className="comments-title">
                  <FaComment className="icon" />
                  {comments.length}{" "}
                  {comments.length === 1 ? "Comment" : "Comments"}
                </h3>

                <form onSubmit={handleCommentSubmit} className="comment-form">
                  <h4>Leave a Comment</h4>
                  <div className="form-group">
                    <input
                      type="text"
                      value={user.username}
                      disabled
                      placeholder="Your Name*"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      placeholder="Your Email*"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      placeholder="Write your comment here*"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="submit-button">
                    <FaPaperPlane className="icon" />
                    Post Comment
                  </button>
                </form>

                <div className="comments-list">
                  {comments.length === 0 ? (
                    <p className="no-comments">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    <>
                      {visibleComments.map((comment) => (
                        <div key={comment._id} className="comment-card">
                          <div className="comment-header">
                            <div className="comment-author">
                              <FaUser className="icon" />
                              <span>{comment.name}</span>
                            </div>
                            <span className="comment-date">
                              {formatCommentDate(comment.createdAt)}
                            </span>
                          </div>
                          <div className="comment-text">{comment.text}</div>

                          <div className="comment-actions">
                            <button
                              className={`like-button ${
                                isCommentLikedByUser(comment) ? "liked" : ""
                              }`}
                              onClick={() => handleLikeComment(comment._id)}
                            >
                              {isCommentLikedByUser(comment) ? (
                                <FaThumbsUp />
                              ) : (
                                <FaRegThumbsUp />
                              )}
                              <span>{comment.likes || 0}</span>
                            </button>

                            <button
                              className="reply-button"
                              onClick={() =>
                                setReplyingTo(
                                  replyingTo === comment._id
                                    ? null
                                    : comment._id
                                )
                              }
                            >
                              <FaReply className="icon" />
                              <span>Reply</span>
                            </button>
                          </div>

                          {replyingTo === comment._id && (
                            <div className="reply-form">
                              <textarea
                                placeholder="Write your reply here*"
                                value={replyContent}
                                onChange={(e) =>
                                  setReplyContent(e.target.value)
                                }
                                required
                              />
                              <div className="reply-buttons">
                                <button
                                  className="cancel-reply"
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyContent("");
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="submit-reply"
                                  onClick={() => handleReplySubmit(comment._id)}
                                >
                                  <FaPaperPlane className="icon" />
                                  Post Reply
                                </button>
                              </div>
                            </div>
                          )}

                          {comment.replies && comment.replies.length > 0 && (
                            <div className="replies-container">
                              {comment.replies.map((reply) => (
                                <div key={reply._id} className="reply-card">
                                  <div className="comment-header">
                                    <div className="comment-author">
                                      <FaUser className="icon" />
                                      <span>{reply.name}</span>
                                    </div>
                                    <span className="comment-date">
                                      {formatCommentDate(reply.createdAt)}
                                    </span>
                                  </div>
                                  <div className="comment-text">
                                    {reply.text}
                                  </div>
                                  <div className="comment-actions">
                                    <button
                                      className={`like-button ${
                                        isCommentLikedByUser(reply)
                                          ? "liked"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleLikeComment(reply._id)
                                      }
                                    >
                                      {isCommentLikedByUser(reply) ? (
                                        <FaThumbsUp />
                                      ) : (
                                        <FaRegThumbsUp />
                                      )}
                                      <span>{reply.likes || 0}</span>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}

                      {totalPages > 1 && (
                        <div className="pagination-controls">
                          <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="pagination-button"
                          >
                            <FaChevronLeft className="icon" />
                            Back
                          </button>
                          <span className="page-indicator">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="pagination-button"
                          >
                            Next
                            <FaChevronRight className="icon" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="back-button-container bottom">
              <Link to="/blogs" className="back-button">
                <FaArrowLeft className="icon" />
                Back to Blogs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;
