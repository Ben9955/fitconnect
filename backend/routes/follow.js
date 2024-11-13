import express from "express";

import { protectRoute } from "../middleware/protectRoute.js";
import { followUser, unFollowUser } from "../controllers/followController.js";

const router = express.Router();

router.post("/:id", protectRoute, followUser);

router.delete("/:id", protectRoute, unFollowUser);

export default router;
