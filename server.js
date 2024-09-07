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
const { initializeApp } = require("firebase/app");

dotenv.config();

const app = express();
const port = 3000;
const secretKey = process.env.SECRET_KEY;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "./dist")));
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

// MongoDB connection configuration
const mongoURI = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(mongoURI);
const fb = initializeApp(firebaseConfig); // Initialize Firebase

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

// Route handler for user login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log(`Received login request for username: ${username}`); // Debugging log

  // Simple validation for username and password
  if (!username || !password) {
    console.log("Missing username or password."); // Debugging log
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  try {
    // Fetch user from the database
    const db = client.db(dbName);
    const collection = db.collection("users");
    const user = await collection.findOne({ username });

    if (user) {
      // Compare plain text password (for development purposes only)
      if (password === user.password) {
        console.log("Login successful."); // Debugging log

        // Redirect to /forgot-password upon successful login
        return res.status(200).json({
          message: "Login successful.",
          redirect: "/forgot-password",
        });
      } else {
        console.log("Login failed. Incorrect username or password."); // Debugging log
        return res
          .status(401)
          .json({ message: "Login failed. Incorrect username or password." });
      }
    } else {
      console.log("User not found."); // Debugging log
      return res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    console.error("Error during login:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
