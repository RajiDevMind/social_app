import express from "express";
const router = express.Router()

import {getUsers} from "../controllers/users.js";


router.get("/find/:userID", getUsers)

export default router;