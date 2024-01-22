import dotenv from "dotenv";
dotenv.config();
import connectDB from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
  const createUserPost =
    "SELECT c.*, u.id AS userId, u.name, u.profilePic FROM comments c JOIN users u ON (u.id = c.userId) WHERE c.postId = ?  ORDER BY c.createdAt DESC";
  connectDB.query(createUserPost, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const addComment = (req, res) => {
  const token = req.cookies.assessToken;

  if (!token) return res.status(401).json("User not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token");

    const createUserPost =
      "INSERT INTO comments (`desc`,`createdAt`,`userId`, `postId`) VALUES (?, ?, ?, ?)";

    const userComments = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
    ];
    connectDB.query(createUserPost, userComments, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Yay! Comment was added Successfully!");
    });
  });
};
