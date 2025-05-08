const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  text: {
    type: String,
    required: true,
    maxlength: [500, "Comment should not exceed 500 characters"],
  },
  createdAt: { type: Date, default: Date.now },
  // Add these new fields
  isReply: { type: Boolean, default: false },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comments",
    default: null,
  },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "comments" }],
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

const Comment = mongoose.model("comments", commentSchema);

module.exports = Comment;
