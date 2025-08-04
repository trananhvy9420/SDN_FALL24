const User = require("../models/user.model");
const { generateToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const signIn = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }
    if (!process.env.SECRET_KEY) {
      console.error("SECRET_KEY environment variable is not set.");
      return res.status(500).json({ message: "Server configuration error" });
    }
    // Generate JWT token
    const token = generateToken(
      { id: user._id, us: user.username },
      process.env.SECRET_KEY || "default_secret_key",
      "1h"
    );
    if (!token) {
      return res.status(500).json({ message: "Token generation failed" });
    }
    return res.status(200).json({
      message: "Login successfully",
      access_token: token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error signing in:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
module.exports = {
  signIn,
};
