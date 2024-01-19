import express from "express";
const router = express.Router();

import { getComments, addComment } from "../controllers/comments.js";

router.get("/", getComments);
router.post("/", addComment);

export default router;
