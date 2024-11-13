import { ObjectId } from "mongodb";
import { getDb } from "../db/connectToMongoDB.js";

//  follow user
export const followUser = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user id." });
    }

    const targetUserId = new ObjectId(req.params.id);
    const currentUser = req.user;

    if (targetUserId.equals(currentUser._id)) {
      return res.status(400).json({ error: "Users cannot follow themselves." });
    }

    const db = getDb();
    const usersCollection = db.collection("users");

    // Update followers and following only if not already following
    await usersCollection.updateOne(
      { _id: targetUserId, followers: { $ne: currentUser._id } },
      { $push: { followers: currentUser._id } }
    );

    await usersCollection.updateOne(
      {
        _id: new ObjectId(currentUser._id),
        following: { $ne: targetUserId },
      },
      { $push: { following: targetUserId } }
    );

    res.status(200).json({ message: "User followed successfully." });
  } catch (error) {
    console.log("Error in followUser controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// unfollow user
export const unFollowUser = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid user id." });
    }

    const targetUserId = new ObjectId(req.params.id);
    const currentUser = req.user;

    if (targetUserId.equals(currentUser._id)) {
      return res
        .status(400)
        .json({ error: "Users cannot unfollow themselves." });
    }

    const db = getDb();
    const usersCollection = db.collection("users");

    // Update followers and following only if not already following
    await usersCollection.updateOne(
      { _id: targetUserId, followers: { $in: [currentUser._id] } },
      { $pull: { followers: currentUser._id } }
    );

    await usersCollection.updateOne(
      {
        _id: new ObjectId(currentUser._id),
        following: { $in: [targetUserId] },
      },
      { $pull: { following: targetUserId } }
    );

    res.status(200).json({ message: "User unfollowed successfully." });
  } catch (error) {
    console.log("Error in unFollowUser controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
