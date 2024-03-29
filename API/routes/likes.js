import express from "express";
const router = express.Router();

import { getLikes, addLike, deleteLike } from "../controllers/likes.js";

router.get("/", getLikes).post("/", addLike).delete("/", deleteLike);

export default router;
