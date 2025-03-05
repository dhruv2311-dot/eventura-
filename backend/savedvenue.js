const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = "mongodb+srv://dhruvsonagra23:dhruv1723@event23.6qktv.mongodb.net/";
const dbName = "eventura";
let db, usersCollection, venuesCollection;

async function initializeDatabase() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("🟢 Connected to MongoDB Atlas");

        db = client.db(dbName);
        usersCollection = db.collection("users");
        venuesCollection = db.collection("venues");

        app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("🔴 Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
initializeDatabase();

// Routes

// Get all venues
app.get("/venues", async (req, res) => {
    try {
        const venues = await venuesCollection.find().toArray();
        res.status(200).json(venues);
    } catch (error) {
        console.error("🔴 Error fetching venues:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.get("/venues/:id", async (req, res) => {
    try {
        const venue = await venuesCollection.findOne({ _id: req.params.id });
        if (!venue) {
            return res.status(404).json({ message: "Venue not found" });
        }
        res.status(200).json(venue);
    } catch (error) {
        console.error("🔴 Error fetching venue:", error);
        res.status(500).json({ message: "Server error" });
    }
});