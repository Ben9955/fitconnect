import express from "express";
import {
  createPost,
  getFollowingPosts,
  searchPosts,
} from "../controllers/contentsController.js";

const router = express.Router();

router.post("/", createPost);

router.get("/", getFollowingPosts);

router.get("/search", searchPosts);

export default router;
