const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Blog = require("./models/blogModel");
const Comment = require("./models/comments");
const Contact = require("./models/Contact");
const authenticateToken = require("./middleware/authenticateToken");

dotenv.config();
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Helper
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

// Auth Middleware
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token, unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Token failed" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ message: "Admins only" });
};

// Routes
app.get("/", (req, res) => res.send("API Running"));

// Register
app.post("/api/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({ username, email, password, role });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
});

// POST login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update lastActive when the user logs in
    user.lastActive = Date.now();
    await user.save(); // Save the updated user with the new lastActive time

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// Get active users count
app.get("/active-users", async (req, res) => {
  try {
    const lastActive = req.query.lastActive;
    const activeUsers = await User.find({
      lastActive: { $gte: new Date(lastActive) },
    });

    res.json({ count: activeUsers.length });
  } catch (error) {
    res.status(500).json({ message: "Error fetching active users", error });
  }
});

// Update last active time
app.post("/update-last-active", async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, { lastActive: Date.now() });
    res.json({ message: "Last active time updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating last active", error });
  }
});

// GET all users (with optional lastActive filter)
app.get("/api/users", async (req, res) => {
  try {
    const { lastActive } = req.query;

    let query = {};
    if (lastActive) {
      query.lastActive = { $gte: new Date(lastActive) };
    }

    const users = await User.find(query); // Apply filter if present
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
});

// GET user by ID and delete
app.delete("/api/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});
// CREATE Blog
app.post("/api/blogs", protect, async (req, res) => {
  try {
    const blog = new Blog({
      ...req.body,
      user: req.user._id, // ✅ This must be added
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    console.error("Error creating blog:", error); // <- this should show the actual problem
    res.status(500).json({ error: "Failed to create blog" });
  }
});

// READ ALL Blogs with populated username
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("user", "username") // Only populate the username
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// READ ALL Blogs by User
app.get("/api/user/blogs", protect, async (req, res) => {
  try {
    // Fetch blogs created by the logged-in user
    const blogs = await Blog.find({ user: req.user._id });
    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// READ ONE Blog by ID
app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).send("Blog not found");
    res.json(blog);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// UPDATE Blog
app.put("/api/blogs/:id", async (req, res) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// DELETE Blog
app.delete("/api/blogs/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

// Comments Routes
app.get("/api/blogs/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({
      blogId: req.params.id,
      isReply: false,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "replies",
        options: { sort: { createdAt: -1 } },
      });

    res.json(comments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/blogs/:id/comments", async (req, res) => {
  try {
    const comment = new Comment({
      blogId: req.params.id,
      name: req.body.name,
      email: req.body.email,
      text: req.body.text,
      isReply: req.body.isReply || false,
      parentCommentId: req.body.parentCommentId || null,
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add reply to a comment
app.post("/api/blogs/:blogId/comments/:commentId/replies", async (req, res) => {
  try {
    const parentComment = await Comment.findById(req.params.commentId);
    if (!parentComment) {
      return res.status(404).send("Parent comment not found");
    }

    const reply = new Comment({
      blogId: req.params.blogId,
      name: req.body.name,
      email: req.body.email,
      text: req.body.text,
      isReply: true,
      parentCommentId: req.params.commentId,
    });

    await reply.save();

    // Add the reply to the parent comment's replies array
    parentComment.replies.push(reply._id);
    await parentComment.save();

    res.status(201).json(reply);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Like/unlike a comment
app.post("/api/blogs/:blogId/comments/:commentId/like", async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    const userId = req.body.userId; // You'll need to send userId from the frontend

    if (!comment) {
      return res.status(404).send("Comment not found");
    }

    const userIndex = comment.likedBy.indexOf(userId);

    if (userIndex === -1) {
      // Like the comment
      comment.likes += 1;
      comment.likedBy.push(userId);
    } else {
      // Unlike the comment
      comment.likes -= 1;
      comment.likedBy.splice(userIndex, 1);
    }

    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/blogs/:id/like", async (req, res) => {
  try {
    const { action } = req.body; // 'like' or 'unlike'
    const increment = action === "like" ? 1 : -1;

    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: increment } },
      { new: true }
    );

    res.json({ likes: blog.likes });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// contact form data
app.post("/contact-data", async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: "Saved to DB" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save data" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
