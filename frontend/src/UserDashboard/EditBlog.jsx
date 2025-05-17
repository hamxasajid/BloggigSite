import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./EditBlog.css"; // Custom CSS file

const EditBlog = () => {
  const { id } = useParams();
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
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const url = "https://bloggigsite-production.up.railway.app";

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

    // Smooth scroll to top on component mount
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [navigate]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${url}/api/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const blog = res.data;
        setFormData({
          title: blog.title,
          content: blog.content,
          category: blog.category,
          tags: blog.tags.join(", "),
          allowComments: blog.allowComments,
          status: blog.status,
        });
        setExistingImageUrl(blog.coverImage);
        setCoverImagePreview(blog.coverImage);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load blog data");
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({ ...prev, content: value }));
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

  const calculateReadTime = (htmlContent) => {
    const text = htmlContent.replace(/<[^>]+>/g, "");
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / 200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      setSaving(false);
      return;
    }

    let coverImageUrl = existingImageUrl;
    if (coverImageFile) {
      try {
        coverImageUrl = await uploadToCloudinary(coverImageFile);
      } catch {
        setError("Failed to upload new cover image");
        setSaving(false);
        return;
      }
    }

    const updatedBlog = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
      allowComments: formData.allowComments,
      status: formData.status,
      readTime: calculateReadTime(formData.content),
      coverImage: coverImageUrl,
    };

    try {
      const res = await axios.put(`${url}/api/blogs/${id}`, updatedBlog, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 200) {
        setSuccess("Blog updated successfully!");
        setTimeout(() => {
          navigate("/Userdashboard/viewallblogs");
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while updating the blog");
    } finally {
      setSaving(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-blog-container">
      <div className="edit-blog-header">
        <div className="container">
          <h1 className="edit-blog-title">Edit Blog Post</h1>
          <p className="edit-blog-subtitle">Update your existing content</p>
        </div>
      </div>

      <div className="container edit-blog-form-container">
        <div className="edit-blog-card">
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
          {saving && (
            <div className="alert alert-info">
              <div className="d-flex align-items-center">
                <div className="spinner-border me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span>Saving changes... Please wait</span>
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
                    disabled={saving}
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
                    readOnly={saving}
                    placeholder="Write your blog content here..."
                  />
                </div>
              </div>

              <div className="col-md-4">
                {/* Cover Image */}
                <div className="mb-4">
                  <label htmlFor="coverImage" className="form-label fw-bold">
                    Cover Image
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
                        className="btn btn-sm btn-outline-danger me-2"
                        onClick={() => {
                          setCoverImagePreview(existingImageUrl);
                          setCoverImageFile(null);
                        }}
                        disabled={saving}
                      >
                        Reset
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => {
                          document.getElementById("coverImageInput").click();
                        }}
                        disabled={saving}
                      >
                        Change
                      </button>
                      <input
                        type="file"
                        className="form-control d-none"
                        id="coverImageInput"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={saving}
                      />
                    </div>
                  ) : (
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        className="form-control d-none"
                        id="coverImageInput"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
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
                    disabled={saving}
                    id="allowCommentsSwitch"
                  />
                  <label
                    className="form-check-label fw-bold"
                    htmlFor="allowCommentsSwitch"
                  >
                    Allow Comments
                  </label>
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary py-2 fw-bold"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Saving...
                      </>
                    ) : (
                      "Update Blog"
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/Userdashboard/viewallblogs")}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;
