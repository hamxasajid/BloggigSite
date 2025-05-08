import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const calculateReadTime = (htmlContent) => {
    const text = htmlContent.replace(/<[^>]+>/g, ""); // remove HTML tags
    const words = text.trim().split(/\s+/).length;
    const readTime = Math.ceil(words / 200); // average 200 wpm
    return readTime;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    setCoverImageFile(e.target.files[0]);
  };

  const handleContentChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      content: value,
    }));
  };

  const uploadToCloudinary = async (file) => {
    const cloudName = "dr46wo7mq"; // replace with your cloud name
    const uploadPreset = "my_upload_preset"; // replace with your upload preset

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("cloud_name", cloudName);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      formData
    );
    return res.data.secure_url; // Return the image URL from Cloudinary
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
      const res = await axios.post(
        "http://localhost:5000/api/blogs",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 201) {
        setSuccess("Blog created successfully!");
        navigate("/blogs");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while creating the blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 min-vh-100" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4">Create a New Blog</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {loading && (
        <div className="alert alert-info">Uploading... Please wait</div>
      )}

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
            disabled={loading}
          />
        </div>

        {/* Cover Image */}
        <div className="mb-3">
          <label htmlFor="coverImage" className="form-label">
            Cover Image
          </label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
            required
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            readOnly={loading}
          />
        </div>

        {/* Status */}
        <div className="mt-3">
          <label htmlFor="status" className="form-label">
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
        <div className="form-check mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            name="allowComments"
            checked={formData.allowComments}
            onChange={handleChange}
            disabled={loading}
          />
          <label className="form-check-label">Allow Comments</label>
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
