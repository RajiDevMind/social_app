import dotenv from "dotenv";
dotenv.config();
import connectDB from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  // CHECK USER IF EXISTS IN DB
  const checkUser = "SELECT * FROM social_app.users WHERE username = ?";
  connectDB.query(checkUser, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length)
      return res
        .status(409)
        .json("User already exists! Kindly login with your details?");

    // HASH PASSWORD
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // CREATE NEW USER
    const createUser =
      "INSERT INTO users (`username`,`email`,`password`,`name`) VALUES (?, ?, ?, ?)";

    const userDetails = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];
    connectDB.query(createUser, userDetails, (err, data) => {
      if (err)
        return res.status(500).json({ err: "Error occur, Try again!!!" });
      return res.status(200).json("User created successfully!");
    });
  });
};

export const login = (req, res) => {
  const checkUser = "SELECT * FROM social_app.users WHERE username = ?";

  connectDB.query(checkUser, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("User not found!");

    const checkPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );
    if (!checkPassword)
      return res.status(400).json("Incorrect username or password!");

    const token = jwt.sign({ id: data[0].id }, process.env.JWT_SECRET);

    const { password, ...userDetails } = data[0];

    res
      .cookie("assessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(userDetails);
  });
};

export const logout = (req, res) => {
  res
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json("Logout Successfully!");
};
