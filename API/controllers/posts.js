import connectDB from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const token = req.cookies.assessToken;

  if (!token) return res.status(401).json("User not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token");

    const createUserPost =
      "SELECT p.*, u.id AS userId, u.name, u.profilePic FROM posts p JOIN users u ON (u.id = p.userId) LEFT JOIN relationships r ON (p.userId = r.followedUserId) WHERE r.followerUserId = ? OR p.userId = ? ORDER BY p.createdAt DESC";
    connectDB.query(createUserPost, [userInfo.id, userInfo.id], (err, data) => {
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
