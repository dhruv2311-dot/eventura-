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
app.get("/users/:auth0Id/saved-venues", async (req, res) => {
    try {
        const user = await usersCollection.findOne({ auth0Id: req.params.auth0Id });
        if (!user) {
            return res.status(200).json({ savedVenues: [] }); // Return empty array if user doesn't exist
        }
        res.status(200).json({ savedVenues: user.savedVenues || [] });
    } catch (error) {
        console.error("🔴 Error fetching saved venues:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Add or remove a saved venue
app.post("/users/:auth0Id/saved-venues", async (req, res) => {
    try {
        const { auth0Id } = req.params;
        const { venueId, action } = req.body;

        if (!venueId || !action) {
            return res.status(400).json({ message: "Missing venueId or action" });
        }

        // Check if venue exists
        const venueExists = await venuesCollection.findOne({ _id: venueId });
        if (!venueExists) {
            return res.status(404).json({ message: "Venue not found" });
        }

        let user = await usersCollection.findOne({ auth0Id });
        if (!user) {
            // If user doesn't exist, create a new one with the provided auth0Id
            user = {
                auth0Id,
                name: "Unknown", // Placeholder, update as needed
                email: "unknown@example.com", // Placeholder, update as needed
                picture: "",
                savedVenues: [],
            };
            await usersCollection.insertOne(user);
        }

        if (action === "add") {
            if (!user.savedVenues || !user.savedVenues.includes(venueId)) {
                await usersCollection.updateOne(
                    { auth0Id },
                    { $push: { savedVenues: venueId } },
                    { upsert: true } // Ensure the document is created if it doesn't exist
                );
            }
            res.status(200).json({ message: "Venue saved successfully" });
        } else if (action === "remove") {
            await usersCollection.updateOne(
                { auth0Id },
                { $pull: { savedVenues: venueId } }
            );
            res.status(200).json({ message: "Venue removed successfully" });
        } else {
            res.status(400).json({ message: "Invalid action" });
        }
    } catch (error) {
        console.error("🔴 Error updating saved venues:", error);
        res.status(500).json({ message: "Server error" });
    }
});