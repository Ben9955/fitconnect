import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  console.log("get login");
  res.send("get login");
});

router.post("/", (req, res) => {
  console.log("post login");
});

router.delete("/", (req, res) => {
  console.log("delete login");
});

export default router;
