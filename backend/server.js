import express from "express";
import cookieParser from "cookie-parser";

import loginRoutes from "./routes/login.js";
import usersRoutes from "./routes/users.js";
import followRoutes from "./routes/follow.js";
import contentsRoutes from "./routes/contents.js";
import { connectToMongoDB, getDb } from "./db/connectToMongoDB.js";

const port = 8080;

const app = express();

// we use this middleware to handle body - it parse any json comming in
app.use(express.json());
// so we can read the cookies
app.use(cookieParser());

app.use("/M00981592/login", loginRoutes);
app.use("/M00981592/users", usersRoutes);
app.use("/M00981592/follow", followRoutes);
app.use("/M00981592/contents", contentsRoutes);

// Connect to MongoDB first before starting the server
connectToMongoDB()
  .then(() => {
    //  start the server if MongoDB connection is successful
    app.listen(port, () => {
      console.log("Connected to MongoDB and listening on port 8080");
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB", error);
  });
