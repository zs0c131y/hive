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

// app.get("/login", (req, res) => {
//   res.sendFile(path.join(__dirname, "./dist/index.html"));
// });

// Feedback for Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
