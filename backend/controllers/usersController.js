import bcrypt from "bcryptjs";

import { getDb } from "../db/connectToMongoDB.js";
import { generateTokenAndSetCookie } from "../util/generateToken.js";

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passowrds don't match" });
    }

    const db = getDb();
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const insertedUser = await usersCollection.insertOne({
      fullName,
      username,
      password: hashedPassword,
      gender,
      following: [],
      followers: [],
      createdAt: new Date(),
    });

    if (insertedUser.acknowledged) {
      generateTokenAndSetCookie(insertedUser.insertedId, res);

      // response object containing the inserted data and the generated _id
      const newUser = {
        fullName,
        username,
        gender,
        createdAt: new Date(),
        _id: insertedUser.insertedId,
      };
      res.status(201).json(newUser);
    } else {
      res
        .status(400)
        .json({ error: "Failed to insert user data into the database" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// search user
export const searchUser = async (req, res) => {
  const searchQ = req.query.q;

  if (!searchQ || searchQ.trim() === "") {
    return res.status(400).json({ error: "Search query cannot be empty" });
  }

  try {
    const db = getDb();
    const usersCollection = db.collection("users");

    const users = await usersCollection
      .find({
        $or: [
          { fullName: { $regex: searchQ, $options: "i" } },
          { username: { $regex: searchQ, $options: "i" } },
        ],
      })
      .project({
        fullName: 1,
        username: 1,
        profilePhoto: 1,
      })
      .limit(10)
      .toArray();

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in search user controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
