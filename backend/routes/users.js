import express from "express";
import { searchUser, signup } from "../controllers/usersController.js";

const router = express.Router();

router.post("/", signup);

router.get("/search", searchUser);

export default router;
