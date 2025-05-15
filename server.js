const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");
const Blog = require("./models/blogModel");
const Comment = require("./models/comments");
const Like = require("./models/Like");
const Contact = require("./models/Contact");
const auth = require("./middleware/authMiddleware");
const authUpdate = require("./middleware/auth");
const authenticate = require("./middleware/authenticate");

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
      return res
        .status(400)
        .send(
          renderHTML(
            "❌ Token Missing",
            "Token is required to verify your email.",
            false
          )
        );
    }

    const user = await User.findOne({
      "verificationHistory.token": token,
    });

    if (!user) {
      return res
        .status(404)
        .send(
          renderHTML(
            "❌ Invalid Token",
            "The verification link is invalid.",
            false
          )
        );
    }

    const tokenEntry = user.verificationHistory.find(
      (entry) => entry.token === token
    );

    if (!tokenEntry) {
      return res
        .status(400)
        .send(
          renderHTML(
            "❌ Token Not Found",
            "This token was not found in your verification history.",
            false
          )
        );
    }

    if (user.isVerified) {
      return res.send(
        renderHTML(
          "✅ Email Already Verified",
          "Your email address has already been verified.",
          true
        )
      );
    }

    if (tokenEntry.status === "verified" || tokenEntry.status === "expired") {
      return res.send(
        renderHTML(
          "⚠️ Link Expired or Used",
          "This link has either expired or was already used.",
          false
        )
      );
    }

    if (user.verificationTokenExpires < new Date()) {
      tokenEntry.usedAt = new Date();
      tokenEntry.status = "expired";
      await user.save();

      return res.send(
        renderHTML(
          "⚠️ Token Expired",
          "The verification link has expired. Please request a new one.",
          false
        )
      );
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    tokenEntry.usedAt = new Date();
    tokenEntry.status = "verified";

    await user.save();

    // ✅ Success
    res.send(
      renderHTML(
        "✅ Email Verified Successfully",
        "Thank you for confirming your email address. You can now continue to the login page.",
        true
      )
    );
  } catch (err) {
    console.error("Verify error:", err);
    res
      .status(500)
      .send(
        renderHTML(
          "🚫 Server Error",
          "Something went wrong during verification. Please try again later.",
          false
        )
      );
  }
});

// 💡 Reusable HTML rendering function
function renderHTML(title, message, showLoginButton) {
  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
            background: linear-gradient(135deg, #e0eafc, #cfdef3);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            color: #333;
          }
          .card {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 480px;
            width: 100%;
            transition: all 0.3s ease;
          }
          .card h1 {
            color: #1C45C1;
            margin-bottom: 20px;
            font-size: 26px;
          }
          .card p {
            font-size: 16px;
            margin-bottom: 30px;
          }
          .btn {
            display: inline-block;
            padding: 12px 24px;
            font-size: 16px;
            background: #1C45C1;
            color: white;
            border: none;
            border-radius: 6px;
            text-decoration: none;
            transition: background 0.3s ease;
          }
          .btn:hover {
            background: #1639a3;
          }
          .icon {
            font-size: 40px;
            margin-bottom: 20px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">${
            title.includes("✅") ? "✅" : title.includes("⚠️") ? "⚠️" : "❌"
          }</div>
          <h1>${title}</h1>
          <p>${message}</p>
          ${
            showLoginButton
              ? '<a href="https://writethepost.netlify.app/login" class="btn">Continue to Login</a>'
              : ""
          }
        </div>
      </body>
    </html>
  `;
}

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    // 🧍‍♂️ Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🔐 Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 📧 Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    // ⏰ Update last active timestamp
    user.lastActive = Date.now();

    // ✅ Generate the JWT token here before pushing to the database
    const token = generateToken(user._id); // Ensure this generates the token

    // Push the generated token into the user's tokens array
    user.tokens.push({ token });

    // Save the user with the new token
    await user.save();

    // ✅ Respond with user data and token
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token, // Send the generated token back
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
    const blog = await Blog.findById(req.params.id).populate(
      "user",
      "username isVerified role profilePicture"
    );
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

// Get all comments for a blog post
app.get("/api/blogs/:id/comments", async (req, res) => {
  try {
    const comments = await Comment.find({
      blogId: req.params.id,
      isReply: false,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "userId", // populate user who posted the comment
        select: "username profilePicture", // select only necessary fields
      })
      .populate({
        path: "replies",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "userId", // populate user who posted the reply
          select: "username profilePicture", // only needed fields
        },
      });

    res.json(comments);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Create a new comment
app.post("/api/blogs/:id/comments", authenticate, async (req, res) => {
  try {
    const comment = new Comment({
      blogId: req.params.id,
      userId: req.user._id, // 👈 Add userId here
      name: req.body.name,
      email: req.body.email,
      text: req.body.text,
      isReply: req.body.isReply || false,
      parentCommentId: req.body.parentCommentId || null,
    });

    await comment.save();
    await comment.populate("userId", "username profilePicture");
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Add reply to a comment
app.post(
  "/api/blogs/:blogId/comments/:commentId/replies",
  authenticate,
  async (req, res) => {
    try {
      const parentComment = await Comment.findById(req.params.commentId);
      if (!parentComment) {
        return res.status(404).send("Parent comment not found");
      }

      const reply = new Comment({
        blogId: req.params.blogId,
        userId: req.user._id, // 👈 Add userId here
        name: req.body.name,
        email: req.body.email,
        text: req.body.text,
        isReply: true,
        parentCommentId: req.params.commentId,
      });

      await reply.save();
      await reply.populate("userId", "username profilePicture");
      parentComment.replies.push(reply._id);
      await parentComment.save();

      res.status(201).json(reply);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// Like/unlike a comment or reply
app.post(
  "/api/blogs/:blogId/comments/:commentId/like",
  authenticate,
  async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.commentId);
      const userId = req.user._id;

      if (!comment) {
        return res.status(404).send("Comment not found");
      }

      const userIndex = comment.likedBy.indexOf(userId);

      if (userIndex === -1) {
        comment.likes += 1;
        comment.likedBy.push(userId);
      } else {
        comment.likes -= 1;
        comment.likedBy.splice(userIndex, 1);
      }

      await comment.save();

      res.json({
        likes: comment.likes,
        likedBy: comment.likedBy,
      });
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// Update a comment
app.put(
  "/api/blogs/:blogId/comments/:commentId",
  authenticate,
  async (req, res) => {
    try {
      const comment = await Comment.findOneAndUpdate(
        {
          _id: req.params.commentId,
          email: req.user.email, // Ensure only the owner can update
        },
        { text: req.body.text, updatedAt: new Date() },
        { new: true }
      );

      if (!comment) {
        return res.status(404).send("Comment not found or unauthorized");
      }

      res.json(comment);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

// Delete a comment
app.delete(
  "/api/blogs/:blogId/comments/:commentId",
  authenticate,
  async (req, res) => {
    try {
      // First check if it's a reply and remove from parent
      const comment = await Comment.findById(req.params.commentId);
      if (!comment) {
        return res.status(404).send("Comment not found");
      }

      // Check if user is the owner
      if (comment.email !== req.user.email) {
        return res.status(403).send("Unauthorized");
      }

      // If this is a reply, remove from parent's replies array
      if (comment.isReply && comment.parentCommentId) {
        await Comment.findByIdAndUpdate(comment.parentCommentId, {
          $pull: { replies: comment._id },
        });
      }

      // If this is a parent comment, delete all its replies first
      if (!comment.isReply && comment.replies.length > 0) {
        await Comment.deleteMany({ _id: { $in: comment.replies } });
      }

      // Finally delete the comment itself
      await Comment.findByIdAndDelete(req.params.commentId);

      res.send("Comment deleted successfully");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
);

app.post("/api/blogs/:id/like", auth, async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.user.id; // From auth middleware

    const existingLike = await Like.findOne({ blogId, userId });

    if (existingLike) {
      // Unlike
      await existingLike.deleteOne();
    } else {
      // Like
      await Like.create({ blogId, userId });
    }

    const likeCount = await Like.countDocuments({ blogId });
    await Blog.findByIdAndUpdate(blogId, { likes: likeCount });

    res.status(200).json({ likes: likeCount, liked: !existingLike });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/blogs/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const liked = await Like.findOne({
      blogId: req.params.id,
      userId: req.user.id,
    });

    res.json({ ...blog.toObject(), liked: !!liked });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
      socialLinks: user.socialLinks,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
});

// Updated user route (profile update endpoint)
app.put("/profile", authUpdate, async (req, res) => {
  const allowedUpdates = [
    "username",
    "phone",
    "about",
    "education",
    "profilePicture",
    "role",
    "socialLinks",
  ];

  // Validate social links structure if provided
  if (req.body.socialLinks) {
    const validSocialLinks = [
      "facebook",
      "linkedin",
      "github",
      "instagram",
      "portfolio",
    ];

    for (const key in req.body.socialLinks) {
      if (!validSocialLinks.includes(key)) {
        return res.status(400).json({
          message: `Invalid social link type: ${key}`,
        });
      }
    }
  }

  try {
    // Update allowed fields
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        // Special handling for socialLinks to merge with existing
        if (field === "socialLinks") {
          req.user.socialLinks = {
            ...req.user.socialLinks,
            ...req.body.socialLinks,
          };
        } else {
          req.user[field] = req.body[field];
        }
      }
    });

    await req.user.save();

    // Return updated user data without sensitive info
    const userToReturn = req.user.toObject();
    delete userToReturn.password;
    delete userToReturn.tokens;
    delete userToReturn.verificationToken;
    delete userToReturn.verificationTokenExpires;

    res.json({
      success: true,
      user: userToReturn,
    });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
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
