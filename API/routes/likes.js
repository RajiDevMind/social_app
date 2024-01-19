import express from "express";
const router = express.Router();

import { getLikes, addLike, deleteLike } from "../controllers/likes.js";

router.get("/likes", getLikes);
router.post("/likes", addLike);
router.delete("/likes", deleteLike);

export default router;
