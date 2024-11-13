import jwt from "jsonwebtoken";
import { getDb } from "../db/connectToMongoDB.js";
import { ObjectId } from "mongodb";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token Provided" });
    }

    const decoded = jwt.verify(token, "1ahd4js@230/sla£lajsh3");

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }

    const db = getDb();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    req.user = user;
    // move to the next middleware
    next();
  } catch (error) {
    console.log("Error in protectedRoute middleware", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
