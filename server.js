const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const path = require("path");
const nodemailer = require("nodemailer");
const router = express.Router();
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
app.use(express.json());

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

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files to the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname); // Append a unique suffix to the original filename
  },
});
const upload = multer({ storage });

// Route for the root URL to serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Route to save user data to MongoDB
app.post("/users", async (req, res) => {
  const db = client.db(dbName);
  const users = db.collection("users");

  try {
    const { email, name } = req.body;

    const user = await users.findOne({ email });

    if (!user) {
      await users.insertOne({ email, name });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error saving user data:", error);
    res.sendStatus(500);
  }
});

// Route to fetch requests
app.post("/requests", async (req, res) => {
  const db = client.db(dbName);
  const requests = db.collection("requests");
  const now = new Date();
  const cutoffTime = new Date(now - 24 * 60 * 60 * 1000); // 24 hours ago

  try {
    const notAcceptedRequests = await requests
      .find({
        $or: [
          // Requests that are neither accepted nor rejected
          {
            status: { $nin: ["accepted", "rejected"] },
          },
          // Include rejected requests if `rejectedAt` is within the last 24 hours
          {
            status: "rejected",
            rejectedAt: { $gte: cutoffTime },
          },
        ],
      })
      .sort({ createdAt: -1 }) // Sort by creation date
      .toArray();

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

// Route to update request status and send email
app.put("/requests/update/:id", async (req, res) => {
  const db = client.db(dbName);
  const requests = db.collection("requests");
  const { id } = req.params; // Get the request ID from the URL
  const { status, by, acceptedAt, byEmail } = req.body; // Get the new status and 'by' field from the request body

  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ObjectId");
  }

  const objectId = new ObjectId(id);
  let updateFields = {};

  if (status === "accepted") {
    updateFields = {
      status: "accepted",
      acceptedAt: acceptedAt ? new Date(acceptedAt) : new Date(), // Store the time of acceptance
      acceptedBy: by, // Store the name of the person who accepted the request
      acceptedByEmail: byEmail, // Store the email of the person who accepted the request
    };

    // Fetch the request to get the user's email
    const requestToAccept = await requests.findOne({ _id: objectId });

    if (!requestToAccept) {
      return res.status(404).json({ message: "Request not found" });
    }

    // Check if the user is trying to accept their own request
    if (requestToAccept.email === byEmail) {
      return res
        .status(403)
        .json({ message: "You cannot accept your own request." });
    }

    // Send email notification only if 'by' and 'byEmail' are present
    if (by && byEmail) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: requestToAccept.email, // The email of the request creator
        subject: "Your request has been accepted!",
        text: `Hello ${requestToAccept.name},\n\nYour request titled "${requestToAccept.title}" has been accepted by ${by}. You can contact them at ${byEmail}.\n\nThank you!`,
      };

      // Send the email
      await transporter.sendMail(mailOptions);
    } else {
      console.warn("Email not sent: 'by' or 'byEmail' is missing.");
    }
  } else if (status === "rejected") {
    updateFields = {
      status: "rejected",
      rejectedAt: new Date(), // Store the time of rejection
      rejectedBy: by, // Store the name of the person who rejected the request
      rejectedByEmail: byEmail, // Store the email of the person who rejected the request
    };
  }

  try {
    const result = await requests.findOneAndUpdate(
      { _id: objectId },
      { $set: updateFields },
      { returnOriginal: false }
    );

    if (!result.value) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json({
      message: "Request status updated",
      request: result.value,
    });
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

  const { title, description, name, email } = req.body;

  if (!title || !description || !name || !email) {
    return res
      .status(400)
      .json({ message: "Title and description are required." });
  }

  try {
    const result = await buzzEvents.insertOne({
      title,
      description,
      name,
      email,
      createdAt: new Date(),
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
  const cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  try {
    const recentEvents = await buzzEvents
      .find({ createdAt: { $gte: cutoffTime } })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .toArray();

    res.status(200).json(recentEvents);
  } catch (error) {
    console.error("Error fetching buzz events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to fetch user history by acceptedByEmail
app.post("/requests/history", async (req, res) => {
  const db = client.db(dbName);
  const requests = db.collection("requests");
  const { acceptedByEmail } = req.body;

  try {
    // Fetch all requests where acceptedByEmail matches the provided email
    const historyRecords = await requests.find({ acceptedByEmail }).toArray();

    if (historyRecords.length === 0) {
      return res.status(404).json({ message: "No history records found." });
    }

    res.status(200).json(historyRecords);
  } catch (error) {
    console.error("Error fetching user history:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to fetch download requests based on the downloadedByEmail
app.post("/requests/downloads", async (req, res) => {
  const db = client.db(dbName);
  const requests = db.collection("uploads");
  const { email } = req.body;

  try {
    const downloadedRequests = await requests
      .find({ downloadedBy: email })
      .sort({ createdAt: -1 }) // Sort by creation date
      .toArray();

    res.json(downloadedRequests);
  } catch (error) {
    console.error("Error fetching download requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to fetch upload requests based on the uploadedByEmail
app.post("/requests/uploads", async (req, res) => {
  const db = client.db(dbName);
  const requests = db.collection("uploads");
  const { email } = req.body;

  try {
    const uploadedRequests = await requests
      .find({ email: email }) // Use the appropriate field to filter uploads
      .sort({ createdAt: -1 }) // Sort by creation date
      .toArray();

    res.json(uploadedRequests);
  } catch (error) {
    console.error("Error fetching upload requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route for file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { email } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Save the file details to the database if needed
    const db = client.db(dbName);
    const uploadsCollection = db.collection("uploads");
    const fileData = {
      email,
      name: req.body.name,
      title: req.body.title,
      description: req.body.description,
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      uploadDate: new Date(),
    };

    await uploadsCollection.insertOne(fileData);

    res.status(200).json({
      message: "File uploaded successfully.",
      file: fileData,
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to fetch all data from the 'dbank' collection
app.post("/dbank", async (req, res) => {
  const db = client.db(dbName);
  const dbankCollection = db.collection("uploads");

  try {
    const records = await dbankCollection.find({}).toArray();
    res.status(200).json(records);
  } catch (error) {
    console.error("Error fetching data from database:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to handle the file download and ensure email is added to the document
app.post("/download", async (req, res) => {
  const { path, email } = req.body;

  try {
    // Attempt to send the file
    res.download(path, async (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        return res.status(500).send("Failed to download file.");
      }

      // If the download was successful, proceed to update the document
      try {
        const db = client.db(dbName);
        const filesCollection = db.collection("uploads");

        // Add the email to the list if it's not already there
        await filesCollection.updateOne(
          { path },
          { $addToSet: { downloadedBy: email } } // Use $addToSet to prevent duplicates
        );
        console.log(
          `Email ${email} added to the download history for path: ${path}`
        );
      } catch (updateError) {
        console.error("Error updating the document with email:", updateError);
      }
    });
  } catch (error) {
    console.error("Error during the download process:", error);
    res.status(500).send("Failed to process the download request.");
  }
});

// Route to download a file
app.get("/download/:filename", (req, res) => {
  const { filename } = req.params; // Extract the filename from the request parameters
  const filePath = path.join(uploadDir, filename); // Construct the full file path

  // Check if the file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error("File not found:", err);
      return res.status(404).json({ message: "File not found" });
    }

    // Send the file as a response
    res.download(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).json({ message: "Error sending file" });
      }
    });
  });
});

// Route to add a new campus update
app.post("/update", async (req, res) => {
  const db = client.db(dbName);
  const updateCollection = db.collection("updates");

  const { title, description, name, email } = req.body;

  if (!title || !description || !name || !email) {
    return res
      .status(400)
      .json({ message: "Title and description are required." });
  }

  try {
    const result = await updateCollection.insertOne({
      title,
      description,
      name,
      email,
      createdAt: new Date(),
    });

    res.status(200).json({
      message: "Campus update added successfully",
      updateId: result.insertedId,
    });
  } catch (error) {
    console.error("Error adding campus update:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Route to fetch updates
app.post("/updates", async (req, res) => {
  const db = client.db(dbName);
  const updateCollection = db.collection("updates");

  try {
    const recentEvents = await updateCollection
      .find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .toArray();

    res.status(200).json(recentEvents);
  } catch (error) {
    console.error("Error fetching campus updates:", error);
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
