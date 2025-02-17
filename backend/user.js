require("dotenv").config();
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// MongoDB connection details (Replace with your actual MongoDB Atlas URI)
const uri = "mongodb+srv://dhruvsonagra23:dhruv1723@event23.6qktv.mongodb.net/";
const dbName = "eventura";

let db;
let usersCollection;

// Connect to MongoDB and Initialize Collections
async function initializeDatabase() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("🟢 Connected to MongoDB Atlas");

        db = client.db(dbName);
        usersCollection = db.collection("users");

        // Start server only after MongoDB connection is established
        app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });

    } catch (error) {
        console.error("🔴 Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
initializeDatabase();

/**
 * @route   POST /api/auth
 * @desc    Save Auth0 user data to MongoDB
 */
app.post("/auth", async (req, res) => {
    try {
        if (!db || !usersCollection) {
            return res.status(500).json({ message: "Database not initialized" });
        }

        const { sub, name, email, picture } = req.body;

        // Validate required fields
        if (!sub || !name || !email) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if user already exists
        const existingUser = await usersCollection.findOne({ auth0Id: sub });

        if (!existingUser) {
            // Insert new user
            const newUser = { auth0Id: sub, name, email, picture };
            const result = await usersCollection.insertOne(newUser);
            return res.status(201).json({ message: "User saved successfully", userId: result.insertedId });
        }

        res.status(200).json({ message: "User already exists", existingUser });

    } catch (error) {
        console.error("🔴 Error saving user:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
