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
let bookingsCollection;

// Connect to MongoDB and Initialize Collections
async function initializeDatabase() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log('🟢 Connected to MongoDB');

        db = client.db(dbName);
        bookingsCollection = db.collection('bookings');

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

// ✅ **POST API to Create a Booking**
app.post('/bookings', async (req, res) => {
    try {
        if (!db || !bookingsCollection) {
            return res.status(500).json({ message: "Database not initialized" });
        }

        const { userId, eventId, eventName, venue, date } = req.body;

        // Validate required fields
        if (!userId || !eventId || !eventName || !venue || !date) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Insert booking into MongoDB with default "Pending" status
        const newBooking = {
            userId,
            eventId,
            eventName,
            venue,
            date,
            status: "Pending" // Default status
        };

        const result = await bookingsCollection.insertOne(newBooking);
        res.status(201).json({ message: "Booking successful", bookingId: result.insertedId });

    } catch (error) {
        console.error("🔴 Error creating booking:", error);
        res.status(500).json({ message: "Server error", error });
    }
});