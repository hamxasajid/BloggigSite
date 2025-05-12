const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: String,
    about: String,
    education: String,
    profilePicture: String,
    role: {
      type: String,
      enum: ["user", "Pending", "author", "admin"],
      default: "user",
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpires: Date,
    verificationHistory: [
      {
        token: String,
        usedAt: Date,
        status: {
          type: String,
          enum: ["pending", "verified", "expired", "failed"],
        },
      },
    ],
    lastVerificationAttempt: Date,
  },
  { timestamps: true }
);

// Password hash middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate new email verification token
userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  this.verificationToken = token;
  this.verificationTokenExpires = expires;

  // Store in history
  this.verificationHistory.push({
    token,
    usedAt: null,
    status: "pending",
  });

  return token;
};

module.exports = mongoose.model("users", userSchema);
