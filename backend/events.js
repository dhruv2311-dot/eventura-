const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// MongoDB connection details
const uri = "mongodb+srv://dhruvsonagra23:dhruv1723@event23.6qktv.mongodb.net/";
const dbName = "eventura";

let db;
let eventsCollection;

// Connect to MongoDB and Initialize Collections
async function initializeDatabase() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log('🟢 Connected to MongoDB');

        db = client.db(dbName);
        eventsCollection = db.collection('events');

        // Start the server only after MongoDB connection is established
        app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });

    } catch (error) {
        console.error('🔴 Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
initializeDatabase();

// POST API to create an event
app.post('/events', async (req, res) => {
    try {
        if (!db || !eventsCollection) {
            return res.status(500).json({ message: "Database not initialized" });
        }

        const { source_language, event_name, event_type, location, online_url, start_date, end_date, start_time, end_time } = req.body;

        // Validate required fields
        if (!source_language || !event_name || !event_type || !start_date || !end_date || !start_time || !end_time) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate event type
        if (!['location_based', 'online_event', 'hybrid_event'].includes(event_type)) {
            return res.status(400).json({ message: "Invalid event type" });
        }

        // Hybrid Event must have both location and online_url
        if (event_type === 'hybrid_event' && (!location || !online_url)) {
            return res.status(400).json({ message: "Hybrid event requires both location and online URL" });
        }

        // Location-based Event must have a location
        if (event_type === 'location_based' && !location) {
            return res.status(400).json({ message: "Location is required for a location-based event" });
        }

        // Online Event must have an online URL
        if (event_type === 'online_event' && !online_url) {
            return res.status(400).json({ message: "Online event requires an online URL" });
        }

        // Insert event into MongoDB
        const newEvent = {
            source_language,
            event_name,
            event_type,
            location: event_type === 'location_based' || event_type === 'hybrid_event' ? location : null,
            online_url: event_type === 'online_event' || event_type === 'hybrid_event' ? online_url : null,
            start_date,
            end_date,
            start_time,
            end_time
        };

        const result = await eventsCollection.insertOne(newEvent);
        res.status(201).json({ message: "Event created successfully", eventId: result.insertedId });

    } catch (error) {
        console.error("🔴 Error creating event:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
