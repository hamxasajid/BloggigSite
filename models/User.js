// Updated Mongoose user schema
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      match: [
        /^[+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]*$/,
        "Please fill a valid phone number",
      ],
    },
    about: {
      type: String,
      trim: true,
      maxlength: [1000, "About section cannot exceed 1000 characters"],
    },
    education: {
      type: String,
      trim: true,
      maxlength: [200, "Education info cannot exceed 200 characters"],
    },
    profilePicture: {
      type: String,
      trim: true,
      match: [
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
        "Please provide a valid image URL",
      ],
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    socialLinks: {
      facebook: {
        type: String,
        trim: true,
        default: "",
        match: [
          /^(https?:\/\/)?(www\.)?facebook\.com\/.*$/,
          "Please provide a valid Facebook URL",
        ],
      },
      linkedin: {
        type: String,
        trim: true,
        default: "",
        match: [
          /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/,
          "Please provide a valid LinkedIn URL",
        ],
      },
      github: {
        type: String,
        trim: true,
        default: "",
        match: [
          /^(https?:\/\/)?(www\.)?github\.com\/.*$/,
          "Please provide a valid GitHub URL",
        ],
      },
      instagram: {
        type: String,
        trim: true,
        default: "",
        match: [
          /^(https?:\/\/)?(www\.)?instagram\.com\/.*$/,
          "Please provide a valid Instagram URL",
        ],
      },
      portfolio: {
        type: String,
        trim: true,
        default: "",
        match: [
          /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
          "Please provide a valid portfolio URL",
        ],
      },
    },
    role: {
      type: String,
      enum: {
        values: ["user", "Pending", "author", "admin"],
        message: "Invalid role specified",
      },
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    verificationHistory: [
      {
        token: {
          type: String,
          required: true,
        },
        usedAt: {
          type: Date,
        },
        status: {
          type: String,
          enum: ["pending", "verified", "expired", "failed"],
          default: "pending",
        },
      },
    ],
    lastVerificationAttempt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.tokens;
        delete ret.verificationToken;
        delete ret.verificationTokenExpires;
        delete ret.lastVerificationAttempt;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.tokens;
        delete ret.verificationToken;
        delete ret.verificationTokenExpires;
        delete ret.lastVerificationAttempt;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isVerified: 1 });

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// 🔍 Compare hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 📧 Generate email verification token
userSchema.methods.generateVerificationToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  this.verificationToken = token;
  this.verificationTokenExpires = expires;

  this.verificationHistory.push({
    token,
    usedAt: null,
    status: "pending",
  });

  return token;
};

// Virtual for profile completeness score
userSchema.virtual("profileCompletePercentage").get(function () {
  const fields = [
    this.username ? 1 : 0,
    this.email ? 1 : 0,
    this.profilePicture ? 1 : 0,
    this.about ? 1 : 0,
    this.education ? 1 : 0,
    Object.values(this.socialLinks).some((link) => link) ? 1 : 0,
  ];
  return Math.round((fields.reduce((a, b) => a + b, 0) / fields.length) * 100);
});

module.exports = mongoose.model("users", userSchema);
