const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

// MongoDB connection details
const uri = 'mongodb+srv://dhruvsonagra23:dhruv1723@event23.6qktv.mongodb.net/';
const dbName = 'eventura';

let db;
let bookingsCollection;

// 🟢 Connect to MongoDB
async function initializeDatabase() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log('🟢 Connected to MongoDB');

        db = client.db(dbName);
        bookingsCollection = db.collection('bookings');

        app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('🔴 Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
initializeDatabase();

// ✅ POST API to Create a Booking
app.post('/bookings', async (req, res) => {
    try {
        if (!db || !bookingsCollection) {
            return res.status(500).json({ message: 'Database not initialized' });
        }

        const { userId, title, image, description, price, type, count = 1 } = req.body;

        if (!userId || !title || !price || !type) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newBooking = {
            _id: new ObjectId(),
            userId,
            title,
            image: image || null,
            description: description || null,
            price: Number(price),
            type,
            count: Number(count), // Default to 1 if not provided
            status: 'Pending',
            createdAt: new Date(),
        };

        const result = await bookingsCollection.insertOne(newBooking);

        res.status(201).json({ message: 'Booking added successfully', booking: newBooking });
    } catch (error) {
        console.error('🔴 Error creating booking:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ GET API: Fetch User's Bookings
app.get("/bookings/:userId", async (req, res) => {
    try {
        const userId = decodeURIComponent(req.params.userId);
        console.log("✅ Backend Received User ID:", userId);

        const bookings = await bookingsCollection.find({ userId }).toArray();

        res.status(200).json({
            bookings: bookings || [],
            totalItems: bookings.length || 0,
            totalPrice: bookings.reduce((sum, b) => sum + (b.price * (b.count || 1)), 0) || 0,
        });
    } catch (error) {
        console.error("❌ Backend Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ PUT API: Update Booking Status
app.put('/bookings/:userId/:bookingId', async (req, res) => {
    try {
        const { userId, bookingId } = req.params;
        const { status } = req.body;

        if (!['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        if (!ObjectId.isValid(bookingId)) {
            return res.status(400).json({ message: 'Invalid booking ID' });
        }

        const result = await bookingsCollection.updateOne(
            { userId, _id: new ObjectId(bookingId) },
            { $set: { status } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: `Booking ${status.toLowerCase()} successfully` });
    } catch (error) {
        console.error('🔴 Error updating booking status:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});