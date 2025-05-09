import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AdminEditBlog = () => {
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
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const url = "https://bloggigsite-production.up.railway.app";

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
    setCoverImageFile(e.target.files[0]);
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
    const token = localStorage.getItem("token");
    if (!token) {
      setError("User not authenticated");
      return;
    }

    let coverImageUrl = existingImageUrl;
    if (coverImageFile) {
      try {
        coverImageUrl = await uploadToCloudinary(coverImageFile);
      } catch {
        setError("Failed to upload new cover image");
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
        navigate("/admin"); // Redirect to admin dashboard or a relevant page
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while updating the blog");
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;

  return (
    <div className="container py-5 min-vh-100" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">Edit Blog</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Existing Cover Image */}
        {existingImageUrl && (
          <div className="mb-3">
            <label className="form-label">Current Cover Image:</label>
            <br />
            <img
              src={existingImageUrl}
              alt="Cover"
              style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
            />
          </div>
        )}

        {/* Replace Cover Image */}
        <div className="mb-3">
          <label className="form-label">Change Cover Image</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        {/* Category */}
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Category
          </label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        {/* Tags */}
        <div className="mb-3">
          <label htmlFor="tags" className="form-label">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            className="form-control"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
          />
        </div>

        {/* Content */}
        <div className="mb-5">
          <label className="form-label">Content</label>
          <ReactQuill
            theme="snow"
            value={formData.content}
            onChange={handleContentChange}
            style={{ height: "200px" }}
          />
        </div>

        {/* Status */}
        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            className="form-select"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Allow Comments */}
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="allowComments"
            checked={formData.allowComments}
            onChange={handleChange}
          />
          <label className="form-check-label">Allow Comments</label>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default AdminEditBlog;
