const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// MongoDB connection details
const uri = "mongodb+srv://dhruvsonagra23:dhruv1723@event23.6qktv.mongodb.net/";
const dbName = "eventura";

let db;
let contactCollection;

// Connect to MongoDB and Initialize Collections
async function initializeDatabase() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("🟢 Connected to MongoDB");

        db = client.db(dbName);
        contactCollection = db.collection("contactus");

        // Start the server only after MongoDB connection is established
        app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });

    } catch (error) {
        console.error("🔴 Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
initializeDatabase();

// POST API to submit contact form
app.post("/contact", async (req, res) => {
    try {
        if (!db || !contactCollection) {
            return res.status(500).json({ message: "Database not initialized" });
        }

        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Insert contact message into MongoDB
        const newMessage = {
            name,
            email,
            subject,
            message,
            date: new Date()
        };

        const result = await contactCollection.insertOne(newMessage);
        res.status(201).json({ message: "Message sent successfully", messageId: result.insertedId });

    } catch (error) {
        console.error("🔴 Error submitting contact form:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
