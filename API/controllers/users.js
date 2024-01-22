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

export const editUserDetails = (req, res) => {
  const token = req.cookies.assessToken;

  if (!token) return res.status(401).json("User not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token");

    const sqlUpdate =
      "UPDATE users SET `name` =?, `city` =?, `website` =?, `profilePic` =?,`coverPic` =? WHERE  id = ?";

    const details = [
      req.body.name,
      req.body.city,
      req.body.website,
      req.body.coverPic,
      req.body.profilePic,
      userInfo.id,
    ];
    connectDB.query(sqlUpdate, details, (err, data) => {
      if (err) res.status(500).json(err);
      if (data.affectedRows > parseInt(0)) return res.json("Updated!");
      return res.status(403).json("You can update only your post!");
    });
  });
};
