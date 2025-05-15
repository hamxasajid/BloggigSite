const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  text: {
    type: String,
    required: true,
    maxlength: [500, "Comment should not exceed 500 characters"],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  isReply: { type: Boolean, default: false },
  parentCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
});

commentSchema.index({ blogId: 1 });
commentSchema.index({ parentCommentId: 1 });

commentSchema.pre("save", function (next) {
  if (this.isModified("text")) {
    this.updatedAt = new Date();
  }
  next();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
