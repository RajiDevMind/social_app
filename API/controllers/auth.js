import connectDB from "../connect.js";
import bcrypt from "bcryptjs";

export const register = (req, res) => {
  // CHECK USER IF EXISTS IN DB
  const checkUser = "SELECT * FROM social_app.users WHERE username = ?";
  connectDB.query(checkUser, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exists!");

    // HASH PASSWORD
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // CREATE NEW USER
    const createUser =
      "INSERT INTO users (`username`,`email`,`password`,`name`) VALUE (?)";

    const userDetails = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];
    connectDB.query(createUser, [userDetails], (err, data) => {
      if (err)
        return res.status(500).json({ err: "Error occur, Try again!!!" });
      return res.status(200).json("User created successfully!");
    });
  });
};

export const login = (req, res) => {};

export const logout = (req, res) => {};
