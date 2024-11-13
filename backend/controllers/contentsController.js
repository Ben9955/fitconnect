import { ObjectId } from "mongodb";
import { getDb } from "../db/connectToMongoDB.js";

export const createPost = async (req, res) => {
  try {
    const { postText, mediaType, mediaUrl, alt, userId } = req.body;

    // Check if   author: 5 is provided
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Validate inputs to ensure all required fields are present
    if ((!mediaType || !mediaUrl) && !postText) {
      return res
        .status(400)
        .json({ error: "Either media or postText must be provided" });
    }

    const db = getDb();
    const contentsCollection = db.collection("contents");

    const insertedPost = await contentsCollection.insertOne({
      postText,
      media: {
        mediaType,
        mediaUrl,
        alt: alt,
      },
      author: new ObjectId(userId),
      likes: 0,
      comments: [],
      createdAt: new Date(),
    });

    if (insertedPost.acknowledged) {
      const newPost = await contentsCollection.findOne({
        _id: insertedPost.insertedId,
      });
      res.status(201).json(newPost);
    } else {
      res
        .status(400)
        .json({ error: "Failed to insert content data into the database" });
    }
  } catch (error) {
    console.log("Error in createPost controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get following posts
export const getFollowingPosts = async (req, res) => {
  const userId = req.user._id;

  try {
    const db = getDb();

    // Find the user using findOne to get a single document
    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).json({ error: "User not found" });

    const contentsCollection = db.collection("contents");

    // If user is following other users, the `following` field should contain ObjectIds of those users
    const posts = await contentsCollection
      .find({
        author: { $in: user.following.map((id) => new ObjectId(id)) }, // Convert each following ID to ObjectId
      })
      .toArray();

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getFollowingPosts controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// get posts by query
export const searchPosts = async (req, res) => {
  const searchQ = req.query.q;

  if (!searchQ || searchQ.trim() === "") {
    return res.status(400).json({ error: "Search query cannot be empty" });
  }

  try {
    const db = getDb();
    const contentsCollection = db.collection("contents");

    const users = await contentsCollection
      .aggregate([
        // Atlas Search stage for querying
        {
          $search: {
            index: "default", // Use your Atlas Search index
            text: {
              query: searchQ, // Search query (could be dynamically passed)
              path: ["postText", "media.mediaUrl", "media.alt"], // Fields to search
              fuzzy: { maxEdits: 1 }, // Allow fuzzy matches
            },
          },
        },
        // Sort stage to sort by createdAt in descending order (newest first)
        {
          $sort: { createdAt: -1 }, // Sort by createdAt in descending order
        },
        // Projection stage to return only the necessary fields
        {
          $project: {
            postText: 1,
            "media.mediaType": 1,
            "media.mediaUrl": 1,
            "media.alt": 1,
            createdAt: 1,
            author: 1,
          },
        },
      ])
      .toArray();

    res.status(200).json(users);
  } catch (error) {
    console.log("Error in searchPosts controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
