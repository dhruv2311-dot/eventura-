require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://dhruvsonagra23:dhruv1723@event23.6qktv.mongodb.net/";
const dbName = "eventura";
let db, eventsCollection;

async function initializeDatabase() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log("🟢 Connected to MongoDB Atlas");

        db = client.db(dbName);
        eventsCollection = db.collection("events");

        app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("🔴 Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
initializeDatabase();

// Get all upcoming events
app.get("/events", async (req, res) => {
    try {
        const events = await eventsCollection.find({ status: "Upcoming" }).toArray();
        console.log("Fetched events:", events);
        res.status(200).json(events);
    } catch (error) {
        console.error("🔴 Error fetching events:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get a single event by ID
app.get("/events/:id", async (req, res) => {
    try {
        const event = await eventsCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error("🔴 Error fetching event:", error);
        res.status(500).json({ message: "Server error" });
    }
});