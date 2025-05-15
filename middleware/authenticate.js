const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user based on decoded._id and token
    const user = await User.findOne({
      _id: decoded.id, // match 'id' from token
      "tokens.token": token,
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 4. Attach user and token to request object
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({
      message: "Please authenticate",
      error: error.message,
    });
  }
};

module.exports = authenticate;
