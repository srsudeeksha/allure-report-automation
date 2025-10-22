const db = require("../db/index");

// Insert new user using Stored Procedure
const createUser = (username, email, password, callback) => {
  const query = "CALL RegisterUser(?, ?, ?)";
  db.query(query, [username, email, password], callback);
};

// Find user by email using Stored Procedure
const findUserByEmail = (email, callback) => {
  const query = "CALL GetUserByEmail(?)";
  db.query(query, [email], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

// ✅ Get all users using Stored Procedure
const getAllUsers = (callback) => {
  const query = "CALL GetAllUsers()";
  db.query(query, (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]); // results[0] contains the actual rows
  });
};

module.exports = { createUser, findUserByEmail, getAllUsers };
