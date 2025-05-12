const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Blog = require("./models/blogModel");
const Comment = require("./models/comments");
const Contact = require("./models/Contact");
const auth = require("./middleware/authMiddleware");
const authUpdate = require("./middleware/auth");
const authenticateToken = require("./middleware/authenticateToken");
const crypto = require("crypto");

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
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = new User({ username, email, password });
    const verificationToken = user.generateVerificationToken();
    await user.save();

    res.status(201).json({
      success: true,
      message: "Registration successful",
      verificationToken,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
});

app.post("/api/resend-verification", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = user.generateVerificationToken();
    await user.save();

    return res.status(200).json({
      email: user.email,
      username: user.username,
      verificationToken: token,
    });
  } catch (err) {
    console.error("Resend error:", err);
    res.status(500).json({ message: "Could not resend verification" });
  }
});

app.get("/api/verify-email", async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Find user who has this token in their history
    const user = await User.findOne({
      "verificationHistory.token": token,
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid token" });
    }

    const tokenEntry = user.verificationHistory.find(
      (entry) => entry.token === token
    );

    if (!tokenEntry) {
      return res.status(400).json({ message: "Token not found" });
    }

    // ✅ Already verified — just return success
    if (user.isVerified) {
      return res.status(200).json({ message: "Email already verified!" });
    }

    // ⌛ Token expired or already used
    if (tokenEntry.status === "verified" || tokenEntry.status === "expired") {
      return res
        .status(400)
        .json({ message: "Link has expired or already used" });
    }

    // ⌛ Token expired
    if (user.verificationTokenExpires < new Date()) {
      tokenEntry.usedAt = new Date();
      tokenEntry.status = "expired";
      await user.save();

      return res.status(400).json({ message: "Token has expired" });
    }

    // ✅ Now verify the user
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    tokenEntry.usedAt = new Date();
    tokenEntry.status = "verified";

    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error("Verify error:", err);
    res.status(500).json({ message: "Server error during verification" });
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

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    // Update lastActive when the user logs in
    user.lastActive = Date.now();
    await user.save();

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

    const users = await User.find(query);
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
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error(error); // Log the error to the console for better debugging
    res
      .status(500)
      .json({ error: "Failed to fetch blogs", details: error.message });
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

app.get("/api/comments", async (req, res) => {
  try {
    // Fetch all comments from the Comment model
    const comments = await Comment.find(); // This retrieves all comments from the database
    res.status(200).json({ comments }); // Send the comments in the response
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ message: "Server error while fetching comments." });
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

app.post("/contact-data", async (req, res) => {
  try {
    const { from_name, from_email, subject, message } = req.body;

    const contact = new Contact({
      name: from_name,
      email: from_email,
      subject,
      message,
    });

    await contact.save();
    res.status(201).json({ message: "Message saved successfully" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

app.get("/contact-data", async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Update message status
app.patch("/contact-data/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(message);
  } catch (err) {
    res.status(500).json({ error: "Failed to update message" });
  }
});

// Delete message
app.delete("/contact-data/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
});

app.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      username: user.username,
      email: user.email,
      phone: user.phone,
      about: user.about,
      education: user.education,
      role: user.role,
      profilePicture: user.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
});

app.put("/profile", authUpdate, async (req, res) => {
  const allowedUpdates = [
    "username",
    "phone",
    "about",
    "education",
    "profilePicture",
    "role",
  ];

  // Update all fields including role
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] = req.body[field];
    }
  });

  try {
    await req.user.save();

    // Return updated user data but don't include sensitive info
    const userToReturn = req.user.toObject();
    delete userToReturn.password;

    res.json(userToReturn);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body; // We assume you're sending the updated role in the body

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the role is Pending, if so, update it to Author
    if (user.role === "Pending" && role === "author") {
      user.role = "author"; // Update the role to author
      await user.save(); // Save the updated user

      return res.status(200).json({ message: "Role updated successfully" });
    } else {
      return res.status(400).json({ message: "Invalid role update" });
    }
  } catch (err) {
    console.error("Error updating role:", err);
    res
      .status(500)
      .json({ message: "Failed to update role. Please try again." });
  }
});
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

