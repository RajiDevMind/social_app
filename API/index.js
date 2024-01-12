import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";

import usersRoutes from "./routes/users.js";
import postsRoutes from "./routes/posts.js";
import likesRoutes from "./routes/likes.js";
import commentsRoutes from "./routes/comments.js";
import authsRoutes from "./routes/auth.js";

const port = process.env.PORT || 8800;

// MIDDLEWAREs
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello, World");
});

app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/auth", authsRoutes);

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}...`);
});

// git clone single-branch -b "react-social-ui" https://github.com/safak/youtube2022.git
