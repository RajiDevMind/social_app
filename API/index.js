import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";

import usersRoutes from "./routes/users.js";
import postsRoutes from "./routes/posts.js";
import likesRoutes from "./routes/likes.js";
import commentsRoutes from "./routes/comments.js";
import authsRoutes from "./routes/auth.js";
import multer from "multer";

const port = process.env.PORT || 8800;

// MIDDLEWAREs
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    // set uploads img to a unique name
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/auth", authsRoutes);

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}...`);
});
