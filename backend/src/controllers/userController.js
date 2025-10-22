const { getAllUsers } = require("../data/userData");

// Fetch all users
const fetchAllUsers = (req, res) => {
  getAllUsers((err, users) => {
    console.log("fetching all users");
    if (err) {
      console.log("Error fetching users:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }
    res.status(200).json(users);
  });
};

module.exports = { fetchAllUsers };
