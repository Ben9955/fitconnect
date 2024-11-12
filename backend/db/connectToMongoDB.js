import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://teacher:xlyLa2dlV7gZKYMH@fitconnectcluster0.zjtun.mongodb.net/?retryWrites=true&w=majority&appName=fitconnectCluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});

let db;

// Function to connect to the database
export async function connectToMongoDB() {
  try {
    // Connect the client to the MongoDB server
    await client.connect();
    console.log("Connected successfully to MongoDB");
    db = client.db("fitconnect");
    // Send a ping to confirm a successful connection
    await db.command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    throw error;
  }
}

export const getDb = () => db;
