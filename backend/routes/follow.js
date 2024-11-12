import express from "express";

const router = express.Router();

router.post("/", (req, res) => {
  console.log("follow user");
});

router.delete("/", (req, res) => {
  console.log("unfollow user");
});

export default router;
