import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BlogDetails.css";
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
  FaEdit,
  FaTrash,
  FaEllipsisV,
  FaRegBookmark,
  FaBookmark,
  FaShare,
} from "react-icons/fa";
import { BiCategory } from "react-icons/bi";
import { FiTag } from "react-icons/fi";
import {
  Dropdown,
  Modal,
  Badge,
  Button,
  Form,
  Card,
  Container,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { formatDistanceToNow } from "date-fns";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (!dateString || isNaN(date.getTime())) {
    return "Unknown date"; // fallback
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [user, setUser] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  // const url = "http://localhost:5000";
  const url = "https://bloggigsite-production.up.railway.app";

  const COMMENTS_PER_PAGE = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const blogRes = await axios.get(`${url}/api/blogs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlog(blogRes.data);
        setLikes(blogRes.data.likes || 0);
        setHasLiked(blogRes.data.liked || false);

        if (blogRes.data.allowComments) {
          const commentsRes = await axios.get(
            `${url}/api/blogs/${id}/comments`
          );
          console.log(commentsRes.data);
          setComments(commentsRes.data);
        }

        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // Check if blog is bookmarked
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
        setBookmarked(bookmarks.includes(id));
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
  }, [id]);

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    if (bookmarked) {
      const updatedBookmarks = bookmarks.filter((blogId) => blogId !== id);
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    } else {
      localStorage.setItem("bookmarks", JSON.stringify([...bookmarks, id]));
    }
    setBookmarked(!bookmarked);
  };

  const handleShare = () => {
    setIsSharing(true);
    if (navigator.share) {
      navigator
        .share({
          title: blog.title,
          text: `Check out this blog post: ${blog.title}`,
          url: window.location.href,
        })
        .then(() => setIsSharing(false))
        .catch(() => setIsSharing(false));
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsSharing(false);
      alert("Link copied to clipboard!");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/api/blogs/${id}/comments`,
        {
          name: user.username,
          email: user.email,
          text: newComment,
          isReply: false,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([response.data, ...comments]);
      setNewComment("");
      setCurrentPage(1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit comment");
    }
  };

  const handleReplySubmit = async (parentCommentId) => {
    if (!replyContent.trim()) return;

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/api/blogs/${id}/comments/${parentCommentId}/replies`,
        {
          name: user.username,
          email: user.email,
          text: replyContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/api/blogs/${id}/comments/${commentId}/like`,
        {
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
      setError(err.response?.data?.message || "Failed to like comment");
    }
  };

  const handleLikeToggle = async () => {
    if (!user) return navigate("/login");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${url}/api/blogs/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setHasLiked(response.data.liked);
      setLikes(response.data.likes);
    } catch {
      setError("Failed to update like status");
    }
  };

  function formatCommentDate(dateString) {
    const date = new Date(dateString);

    if (!dateString || isNaN(date.getTime())) {
      return "Unknown date"; // fallback
    }

    return formatDistanceToNow(date, { addSuffix: true });
  }

  const startEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditContent(comment.text);
  };

  const handleEditSubmit = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${url}/api/blogs/${id}/comments/${commentId}`,
        { text: editContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(
        comments.map((comment) => {
          if (comment._id === commentId) {
            return { ...comment, text: editContent };
          }
          if (comment.replies) {
            const updatedReplies = comment.replies.map((reply) => {
              if (reply._id === commentId) {
                return { ...reply, text: editContent };
              }
              return reply;
            });
            return { ...comment, replies: updatedReplies };
          }
          return comment;
        })
      );

      setEditingComment(null);
      setEditContent("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update comment");
    }
  };

  const confirmDelete = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const handleDeleteComment = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${url}/api/blogs/${id}/comments/${commentToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the comment from state
      setComments(
        comments.filter((comment) => {
          if (comment._id === commentToDelete) return false;
          if (comment.replies) {
            comment.replies = comment.replies.filter(
              (reply) => reply._id !== commentToDelete
            );
          }
          return true;
        })
      );

      setShowDeleteModal(false);
      setCommentToDelete(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete comment");
    }
  };

  const isCommentLikedByUser = (comment) => {
    return comment.likedBy && user && comment.likedBy.includes(user._id);
  };

  const isUserComment = (comment) => {
    return user && comment.email === user.email;
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

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
        <Button as={Link} to="/blogs" variant="primary">
          Back to Blogs
        </Button>
      </Container>
    );
  }

  if (!blog) {
    return (
      <Container className="my-5">
        <Alert variant="warning" className="mb-4">
          Blog post not found
        </Alert>
        <Button as={Link} to="/blogs" variant="primary">
          Back to Blogs
        </Button>
      </Container>
    );
  }

  const renderCommentActions = (comment, isReply = false) => {
    return (
      <div className="d-flex gap-2 align-items-center">
        <Button
          size="sm"
          variant={
            isCommentLikedByUser(comment) ? "primary" : "outline-primary"
          }
          onClick={() => handleLikeComment(comment._id)}
          disabled={!user}
          title={!user ? "Login to like" : ""}
          className="d-flex align-items-center"
        >
          {isCommentLikedByUser(comment) ? <FaThumbsUp /> : <FaRegThumbsUp />}
          <span className="ms-1">{comment.likes || 0}</span>
        </Button>

        {!isReply && user && (
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() =>
              setReplyingTo(replyingTo === comment._id ? null : comment._id)
            }
            className="d-flex align-items-center"
          >
            <FaReply className="me-1" />
            Reply
          </Button>
        )}

        {isUserComment(comment) && (
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              id={`dropdown-comment-${comment._id}`}
              className="text-dark p-0 no-caret"
              style={{ boxShadow: "none" }}
            >
              <FaEllipsisV />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={() => startEditComment(comment)}>
                <FaEdit className="me-2" />
                Edit
              </Dropdown.Item>
              <Dropdown.Item onClick={() => confirmDelete(comment._id)}>
                <FaTrash className="me-2 text-danger" />
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    );
  };

  const renderComment = (comment, isReply = false) => {
    return (
      <Card
        key={comment._id}
        className={`mb-3 ${
          isReply ? "ms-md-4 ms-3 border-start border-primary" : ""
        }`}
        border="light"
      >
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="d-flex align-items-center">
              <div
                className="bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center"
                style={{ width: "50px", height: "50px", overflow: "hidden" }}
              >
                {comment.userId?.profilePicture ? (
                  <img
                    src={comment.userId.profilePicture}
                    alt={comment.userId.username}
                    className="w-100 h-100"
                    style={{
                      flexShrink: 0,
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <FaUser size={18} />
                )}
              </div>

              <div>
                <h6 className="mb-0 fw-bold">{comment.name}</h6>
                <small className="text-muted">
                  {formatCommentDate(comment.createdAt)}
                </small>
              </div>
            </div>
          </div>

          {editingComment === comment._id ? (
            <div className="mb-3">
              <Form.Control
                as="textarea"
                rows={3}
                className="mb-2"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleEditSubmit(comment._id)}
                >
                  Save
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="mb-3">
              <p className="mb-0">{comment.text}</p>
            </div>
          )}

          {renderCommentActions(comment, isReply)}

          {replyingTo === comment._id && user && !isReply && (
            <div className="mt-3">
              <Form.Control
                as="textarea"
                rows={3}
                className="mb-2"
                placeholder="Write your reply here*"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                required
              />
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleReplySubmit(comment._id)}
                >
                  <FaPaperPlane className="me-1" />
                  Post Reply
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map((reply) => renderComment(reply, true))}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  return (
    <Container className="py-4 py-lg-5">
      <Row className="justify-content-center">
        <Col lg={9}>
          <Button
            as={Link}
            to="/blogs"
            variant="outline-primary"
            className="mb-4 d-inline-flex align-items-center"
          >
            <FaArrowLeft className="me-2" />
            Back to Blogs
          </Button>

          <Card className="mb-4 border-0 shadow-sm">
            <div className="ratio ratio-16x9">
              <Card.Img
                variant="top"
                src={blog.coverImage}
                alt={blog.title}
                style={{
                  height: "auto",
                  aspectRatio: "16 / 9",
                  flexShrink: 0,
                }}
              />
            </div>
            <Card.Body>
              <div className="d-flex justify-content-between flex-wrap gap-2 mb-3">
                <div className="start d-flex flex-wrap gap-2 mb-3">
                  <Badge
                    bg={blog.status === "published" ? "success" : "secondary"}
                    className="d-flex align-items-center"
                  >
                    {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                  </Badge>

                  <small className="text-muted d-flex align-items-center">
                    <FaCalendarAlt className="me-1" />
                    {formatDate(blog.createdAt)}
                  </small>

                  <small className="text-muted d-flex align-items-center">
                    <FaClock className="me-1" />
                    {blog.readTime} min read
                  </small>

                  {blog.allowComments && (
                    <small className="text-muted d-flex align-items-center">
                      <FaComment className="me-1" />
                      {comments.length} comments
                    </small>
                  )}
                </div>

                <div className="end d-flex justify-content-center align-items-center gap-2">
                  <small className="text-muted d-flex align-items-center">
                    <FaUser className="me-1" />
                    {blog.user?.username}
                    {blog.user?.isVerified && blog.user?.role === "author" && (
                      <i
                        className="ms-1 bi bi-patch-check-fill text-primary"
                        title="Verified Author"
                      ></i>
                    )}
                  </small>
                </div>
              </div>

              <Card.Title as="h1" className="mb-3 fw-bold">
                {blog.title}
              </Card.Title>

              <div className="d-flex flex-wrap gap-2 mb-4">
                <Badge bg="info" className="d-flex align-items-center">
                  <BiCategory className="me-1" />
                  {blog.category}
                </Badge>
                {blog.tags &&
                  blog.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      bg="light"
                      text="dark"
                      className="d-flex align-items-center"
                    >
                      <FiTag className="me-1" />
                      {tag}
                    </Badge>
                  ))}
              </div>

              <div
                className="mb-4"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              <div className="d-flex align-items-center gap-3">
                <Button
                  variant={hasLiked ? "primary" : "outline-primary"}
                  onClick={handleLikeToggle}
                  className="d-flex align-items-center"
                >
                  {hasLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
                  <span className="ms-2">{likes}</span>
                </Button>
                <Button
                  variant={bookmarked ? "warning" : "outline-warning"}
                  onClick={handleBookmark}
                  title={bookmarked ? "Remove bookmark" : "Bookmark this post"}
                >
                  {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
                </Button>
                <Button
                  variant="outline-secondary"
                  className="share-btn"
                  onClick={handleShare}
                  disabled={isSharing}
                >
                  <FaShare className="me-1" />
                  Share
                </Button>
              </div>
            </Card.Body>
          </Card>

          {blog.allowComments && (
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Body>
                <Card.Title as="h3" className="mb-4 d-flex align-items-center">
                  <FaComment className="me-2" />
                  {comments.length}{" "}
                  {comments.length === 1 ? "Comment" : "Comments"}
                </Card.Title>

                {user ? (
                  <Form onSubmit={handleCommentSubmit} className="mb-4">
                    <h5 className="mb-3">Leave a Comment</h5>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="text"
                        value={user.username}
                        disabled
                        placeholder="Your Name*"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="email"
                        value={user.email}
                        disabled
                        placeholder="Your Email*"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Write your comment here*"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      <FaPaperPlane className="me-1" />
                      Post Comment
                    </Button>
                  </Form>
                ) : (
                  <Alert variant="info">
                    Please <Link to="/login">login</Link> to leave a comment.
                  </Alert>
                )}

                <div className="comments-list">
                  {comments.length === 0 ? (
                    <Alert variant="secondary">
                      No comments yet. Be the first to comment!
                    </Alert>
                  ) : (
                    <>
                      {visibleComments.map((comment) => renderComment(comment))}

                      {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center mt-4">
                          <Button
                            variant="outline-primary"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="d-flex align-items-center"
                          >
                            <FaChevronLeft className="me-1" />
                            Previous
                          </Button>
                          <span className="text-muted">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            variant="outline-primary"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="d-flex align-items-center"
                          >
                            Next
                            <FaChevronRight className="ms-1" />
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card.Body>
            </Card>
          )}

          <Button
            as={Link}
            to="/blogs"
            variant="outline-primary"
            className="d-inline-flex align-items-center"
          >
            <FaArrowLeft className="me-2" />
            Back to Blogs
          </Button>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this comment? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteComment}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BlogDetails;
