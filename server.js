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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
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

// Route to fetch all requests
app.post("/requests", async (req, res) => {
  const db = client.db(dbName);
  const requests = db.collection("requests");
  const notAcceptedRequests = await requests
    .find({ status: { $ne: "accepted" } })
    .toArray();

  res.json(notAcceptedRequests);
});

// Route to add a request
app.post("/add-request", async (req, res) => {
  const db = client.db(dbName);
  const requests = db.collection("requests");

  try {
    const result = await requests.insertOne(req.body);
    res
      .status(200)
      .json({
        message: "Request added successfully",
        requestId: result.insertedId,
      });
  } catch (error) {
    console.error("Error adding request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Feedback for Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
