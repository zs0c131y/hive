const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const path = require("path");
const crypto = require("crypto");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const uploadDir = "./uploads";
const dotenv = require("dotenv");
const { ObjectId } = require("mongodb");

dotenv.config();

const app = express();
const port = 3000;
const secretKey = process.env.SECRET_KEY;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "./dist")));

// MongoDB configuration
const mongoURI = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(mongoURI);

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB.");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
}

void connectToMongoDB();

// Route for the root URL to serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});

// Route to save user data to MongoDB
app.post("/users", async (req, res) => {
  const db = client.db(dbName);
  const users = db.collection("users");

  try {
    const { email } = req.body;
    const user = await users.findOne({ email });

    if (!user) {
      await users.insertOne({ email });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error saving user data:", error);
    res.sendStatus(500);
  }
});

// Fetching requests from database
app.post("/requests", async (req, res) => {
  const db = client.db(dbName);
  const requests = db.collection("requests");
  const now = new Date();

  // Calculate cutoff time for rejected requests and convert to ISO string
  const cutoffTime = new Date(now - 24 * 60 * 60 * 1000).toISOString();

  try {
    const notAcceptedRequests = await requests
      .find({
        $or: [
          // Include all requests that are neither accepted nor rejected
          {
            $and: [
              { status: { $ne: "accepted" } },
              { status: { $ne: "rejected" } },
            ],
          },
          // Include rejected requests within the last 24 hours
          { status: "rejected", createdAt: { $gte: cutoffTime } },
        ],
      })
      .toArray();

    // No need to convert createdAt if it's already a string, just sort
    notAcceptedRequests.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.json(notAcceptedRequests);
  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to add a request
app.post("/add-request", async (req, res) => {
  const db = client.db(dbName);
  const requests = db.collection("requests");

  try {
    const result = await requests.insertOne(req.body);
    res.status(200).json({
      message: "Request added successfully",
      requestId: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to update request status
app.put("/requests/update/:id", async (req, res) => {
  const db = client.db(dbName);
  const requests = db.collection("requests");
  const { id } = req.params; // Get the request ID from the URL
  const { status } = req.body; // Get the new status from the request body

  try {
    const result = await requests.findOneAndUpdate(
      { _id: new ObjectId(id) }, // Find the request by its ID
      { $set: { status: status } }, // Set the new status
      { returnOriginal: false }
    );

    if (!result) {
      return res.status(404).json({ message: "Request not found" });
    }

    res
      .status(200)
      .json({ message: "Request status updated", request: result.value });
  } catch (error) {
    console.error("Error updating request status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to fetch user profile by email
app.post("/profile", async (req, res) => {
  const db = client.db(dbName);
  const users = db.collection("users");
  const { email } = req.body;

  try {
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      name: user.name || "No name provided",
      email: user.email,
      records: user.records || [], // Assuming you store records with the user
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to add a new buzz event
app.post("/buzzupdate", async (req, res) => {
  const db = client.db(dbName);
  const buzzEvents = db.collection("buzzEvents");

  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ message: "Title and description are required." });
  }

  try {
    const result = await buzzEvents.insertOne({
      title,
      description,
      createdAt: new Date(), // Record the creation time
    });

    res.status(200).json({
      message: "Buzz event added successfully",
      eventId: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding buzz event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to fetch buzz events
app.post("/getbuzz", async (req, res) => {
  const db = client.db(dbName);
  const buzzEvents = db.collection("buzzEvents");
  const now = new Date();
  const cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

  try {
    const recentEvents = await buzzEvents
      .find({ createdAt: { $gte: cutoffTime } })
      .project({ title: 1, description: 1, createdAt: 1 }) // Project specific fields
      .toArray();

    // Send successful JSON response
    res.status(200).json(recentEvents);
  } catch (error) {
    console.error("Error fetching buzz events:", error);

    // Ensure JSON response even in case of an error
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Feedback for Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
