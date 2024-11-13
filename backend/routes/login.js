import express from "express";
import {
  checkLoginStatus,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, checkLoginStatus);

router.post("/", loginUser);

router.delete("/", logoutUser);

export default router;
