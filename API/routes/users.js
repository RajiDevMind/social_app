import express from "express";
const router = express.Router();

import { getUsers } from "../controllers/users.js";

router.get("/find/:userId", getUsers);

export default router;
