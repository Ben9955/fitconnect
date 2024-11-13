import bcrypt from "bcryptjs";

import { getDb } from "../db/connectToMongoDB.js";
import { generateTokenAndSetCookie } from "../util/generateToken.js";

export const checkLoginStatus = (req, res) => {
  // If protectRoute succeeds, req.user will be populated with user data
  res.status(200).json({
    message: "User is logged in",
    user: req.user, // Contains user details without password
  });
};

//  login user
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const db = getDb();
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      followers: user.followers,
      following: user.following,
      gender: user.gender,
    });
  } catch (error) {
    console.log("Error in loginUser controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// login out
export const logoutUser = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logoutUser controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
