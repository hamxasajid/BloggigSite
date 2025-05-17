import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CreateBlog.css"; // Custom CSS file

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    allowComments: true,
    status: "draft",
  });

  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const url = "https://bloggigsite-production.up.railway.app";

  const calculateReadTime = (htmlContent) => {
    const text = htmlContent.replace(/<[^>]+>/g, "");
    const words = text.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / 200);
    return readTime;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      const user = JSON.parse(storedUser);
      if (user.role !== "author") {
        navigate("/");
      }
    }
    setLoading(false);

    // Smooth scroll to top on component mount
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const uploadToCloudinary = async (file) => {
    const cloudName = "dr46wo7mq";
    const uploadPreset = "my_upload_preset";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const readTime = calculateReadTime(formData.content);
    const tagsArray = formData.tags.split(",").map((tag) => tag.trim());

    let coverImageUrl = "";
    if (coverImageFile) {
      try {
        coverImageUrl = await uploadToCloudinary(coverImageFile);
      } catch {
        setError("Failed to upload cover image to Cloudinary");
        setLoading(false);
        return;
      }
    }

    const formDataToSend = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: tagsArray,
      allowComments: formData.allowComments,
      status: formData.status,
      readTime,
      coverImage: coverImageUrl,
    };

    try {
      const res = await axios.post(`${url}/api/blogs`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        setSuccess("Blog created successfully!");
        setTimeout(() => {
          navigate("/blogs");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while creating the blog");
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="create-blog-container">
      <div className="create-blog-header">
        <div className="container">
          <h1 className="create-blog-title">Create New Blog Post</h1>
          <p className="create-blog-subtitle">
            Share your thoughts with the world
          </p>
        </div>
      </div>

      <div className="container create-blog-form-container">
        <div className="create-blog-card">
          {error && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              {error}
              <button
                type="button"
                className="btn-close"
                onClick={() => setError("")}
                aria-label="Close"
              ></button>
            </div>
          )}
          {success && (
            <div
              className="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              {success}
              <button
                type="button"
                className="btn-close"
                onClick={() => setSuccess("")}
                aria-label="Close"
              ></button>
            </div>
          )}
          {loading && (
            <div className="alert alert-info">
              <div className="d-flex align-items-center">
                <div className="spinner-border me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span>Uploading... Please wait</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-8">
                {/* Title */}
                <div className="mb-4">
                  <label htmlFor="title" className="form-label fw-bold">
                    Blog Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Enter a captivating title"
                  />
                </div>

                {/* Content */}
                <div className="mb-4">
                  <label className="form-label fw-bold">
                    Content <span className="text-danger">*</span>
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={handleContentChange}
                    style={{ height: "300px", marginBottom: "50px" }}
                    readOnly={loading}
                    placeholder="Write your blog content here..."
                  />
                </div>
              </div>

              <div className="col-md-4">
                {/* Cover Image */}
                <div className="mb-4">
                  <label htmlFor="coverImage" className="form-label fw-bold">
                    Cover Image <span className="text-danger">*</span>
                  </label>
                  {coverImagePreview ? (
                    <div className="mb-3 text-center">
                      <img
                        src={coverImagePreview}
                        alt="Cover preview"
                        className="img-fluid rounded mb-2"
                        style={{ maxHeight: "200px" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          setCoverImagePreview(null);
                          setCoverImageFile(null);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        className="form-control d-none"
                        id="coverImageInput"
                        accept="image/*"
                        onChange={handleFileChange}
                        required
                        disabled={loading}
                      />
                      <label
                        htmlFor="coverImageInput"
                        className="file-upload-label"
                      >
                        <div className="file-upload-content">
                          <i className="bi bi-cloud-arrow-up fs-1"></i>
                          <p className="mb-0">Click to upload cover image</p>
                          <small className="text-muted">
                            Recommended size: 1200x630px
                          </small>
                        </div>
                      </label>
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="mb-4">
                  <label htmlFor="category" className="form-label fw-bold">
                    Category
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="e.g. Technology, Travel"
                  />
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <label htmlFor="tags" className="form-label fw-bold">
                    Tags
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="comma separated (e.g. react, javascript)"
                  />
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label htmlFor="status" className="form-label fw-bold">
                    Status
                  </label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                {/* Allow Comments */}
                <div className="form-check form-switch mb-4">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    role="switch"
                    name="allowComments"
                    checked={formData.allowComments}
                    onChange={handleChange}
                    disabled={loading}
                    id="allowCommentsSwitch"
                  />
                  <label
                    className="form-check-label fw-bold"
                    htmlFor="allowCommentsSwitch"
                  >
                    Allow Comments
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Publishing...
                    </>
                  ) : (
                    "Publish Blog"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
