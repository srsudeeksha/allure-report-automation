const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser, findUserByEmail } = require("../data/userData");
require("dotenv").config();

// Registration
const register = (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length > 0)
      return res.status(400).json({ message: "Email already registered" });

    // Hash password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: err.message });

      // Use SP for user creation
      createUser(username, email, hashedPassword, (err) => {
        if (err) return res.status(500).json({ message: err.message });
        res.status(201).json({ message: "User registered successfully!" });
      });
    });
  });
};

// Login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required" });
  }

  findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = results[0];

    // Compare password
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: err.message });
      if (!isMatch)
        return res.status(400).json({ message: "Incorrect password" });

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ message: "Login successful!", token });
    });
  });
};

module.exports = { register, login };
