const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    category: String,
    tags: [String],
    coverImage: String,
    allowComments: Boolean,
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    readTime: Number,
    likes: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
