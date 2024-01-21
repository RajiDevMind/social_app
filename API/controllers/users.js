import dotenv from "dotenv";
dotenv.config();
import connectDB from "../connect.js";
import jwt from "jsonwebtoken";

export const getUsers = (req, res) => {
  const userId = req.params.userId;

  const sqlQuery = "SELECT * FROM users WHERE id = ?";

  connectDB.query(sqlQuery, [userId], (err, data) => {
    if (err) return res.status(500).json(err);
    const { password, ...userDetails } = data[0];
    return res.json(userDetails);
  });
};
