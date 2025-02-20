require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const uri =  "mongodb+srv://dhruvsonagra23:dhruv1723@event23.6qktv.mongodb.net/"; 
const dbName = "eventura";
let db, feedbackCollection;

async function initializeDatabase() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("🟢 Connected to MongoDB Atlas");

        db = client.db(dbName);
        feedbackCollection = db.collection("feedback");

        app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("🔴 Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
initializeDatabase();

// Cloudinary Configuration
cloudinary.config({
    cloud_name: "dtkzxbcjx",
    api_key: "477896454797144",
    api_secret: "mTrRRVzvsrRIwUGuuxStl4LlG9I",
});

// Multer Setup for File Upload
const upload = multer({ dest: "uploads/" });


app.post("/feedback", upload.single("image"), async (req, res) => {
    try {
        if (!db || !feedbackCollection) {
            return res.status(500).json({ message: "Database not initialized" });
        }

        const { name, email, message, rating } = req.body;
        let imageUrl = null;

        // Validate required fields
        if (!email || !message || !rating) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Upload image to Cloudinary (if provided)
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload(req.file.path);
            imageUrl = uploadResult.secure_url;
            fs.unlinkSync(req.file.path); // Delete file from server after upload
        }

        // Save feedback in MongoDB
        const feedbackData = {
            name: name || "Anonymous",
            email,
            message,
            rating: parseInt(rating),
            image: imageUrl,
            createdAt: new Date(),
        };

        const result = await feedbackCollection.insertOne(feedbackData);
        res.status(201).json({ message: "Feedback submitted successfully", feedbackId: result.insertedId });

    } catch (error) {
        console.error("🔴 Error saving feedback:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
