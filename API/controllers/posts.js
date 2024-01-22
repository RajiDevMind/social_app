import dotenv from "dotenv";
dotenv.config();
import connectDB from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.assessToken;

  if (!token) return res.status(401).json("User not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token");

    // conditionally display post if on profile acct
    const createUserPost = userId
      ? "SELECT p.*, u.id AS userId, u.name, u.profilePic FROM posts p JOIN users u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC"
      : "SELECT p.*, u.id AS userId, u.name, u.profilePic FROM posts p JOIN users u ON (u.id = p.userId) LEFT JOIN relationships r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ? ORDER BY p.createdAt DESC";

    const displayPostConditionally = parseInt(userId)
      ? [userId]
      : [userInfo.id, userInfo.id];
    connectDB.query(createUserPost, displayPostConditionally, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.assessToken;

  if (!token) return res.status(401).json("User not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token");

    const createUserPost =
      "INSERT INTO posts (`desc`,`img`,`createdAt`,`userId`) VALUES (?, ?, ?, ?)";

    const userDetails = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];
    connectDB.query(createUserPost, userDetails, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Yay! Posted Successfully!");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.assessToken;

  if (!token) return res.status(401).json("User not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token");

    const deleteUserPost = "DELETE FROM posts WHERE `id` = ? AND `userId` = ?";

    connectDB.query(
      deleteUserPost,
      [req.query.id, userInfo.id],
      (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.affectedRows > 0)
          return res.status(200).json("Deleted Successfully!");
        return res.status(403).json("Unable to delete!");
      }
    );
  });
};
