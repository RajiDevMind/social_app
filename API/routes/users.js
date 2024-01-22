import express from "express";
const router = express.Router();

import { getUsers, editUserDetails } from "../controllers/users.js";

router.get("/find/:userId", getUsers);
router.put("/", editUserDetails);

export default router;
