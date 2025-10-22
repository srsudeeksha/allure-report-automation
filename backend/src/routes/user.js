const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { fetchAllUsers } = require("../controllers/userController");

// Example protected route
router.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "This is your profile", user: req.user });
});

// ✅ New route to fetch all users (protected)
router.get("/all", fetchAllUsers);

module.exports = router;
