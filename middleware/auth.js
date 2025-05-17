// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id || decoded._id)
      .select("_id username profilePicture")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = {
      _id: user._id,
      username: user.username,
      profilePicture: user.profilePicture,
    };

    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({
      success: false,
      message:
        err.name === "JsonWebTokenError"
          ? "Invalid token"
          : "Authentication failed",
    });
  }
};

module.exports = auth;
