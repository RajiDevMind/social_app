import dotenv from "dotenv";
dotenv.config();
import connectDB from "../connect.js";
import jwt from "jsonwebtoken";

export const getRelationships = (req, res) => {
  const createUserPost =
    "SELECT followerUserId FROM relationships WHERE followedUserId = ?";

  connectDB.query(createUserPost, [req.query.followedUserId], (err, data) => {
    if (err) return res.status(500).json(err);
    // converting resp obj with map method to be iterable (userId)=== data.map((relationship) => relationship.userId)
    return res
      .status(200)
      .json(data.map((relationship) => relationship.followerUserId));
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.assessToken;

  if (!token) return res.status(401).json("User not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token");

    const q =
      "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?, ?)";

    const followers = [userInfo.id, req.body.userId];
    connectDB.query(q, followers, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Yay! followed Successfully!");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.assessToken;

  if (!token) return res.status(401).json("User not logged in!");

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) return res.status(403).json("Invalid token");

    const sql =
      "DELETE FROM relationships WHERE (followerUserId = ?) AND (followedUserId = ?)";

    connectDB.query(sql, [userInfo.id, req.query.userId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Ohh! Unfollow");
    });
  });
};
