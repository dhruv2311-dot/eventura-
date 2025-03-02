const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// MongoDB connection details
const uri = 'mongodb+srv://dhruvsonagra23:dhruv1723@event23.6qktv.mongodb.net/';
const dbName = 'eventura';

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

// ✅ POST API to Create a Booking (Initially Pending)
app.post('/bookings', async (req, res) => {
    try {
        if (!db || !bookingsCollection) {
            return res.status(500).json({ message: 'Database not initialized' });
        }

        const { userId, eventId, eventName, venueId, venueName, date } = req.body;

        // Insert booking into MongoDB with default "Pending" status
        const newBooking = {
            userId,
            eventId: eventId || null, // Event can be null initially
            eventName: eventName || null,
            venueId: venueId || null, // Venue can be null initially
            venueName: venueName || null,
            date,
            status: 'Pending', // Default status
        };

        const result = await bookingsCollection.insertOne(newBooking);
        res.status(201).json({ message: 'Booking successful', bookingId: result.insertedId });

    } catch (error) {
        console.error('🔴 Error creating booking:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ GET API to Fetch User's Bookings
app.get('/bookings/:userId', async (req, res) => {
    try {
        if (!db || !bookingsCollection) {
            return res.status(500).json({ message: 'Database not initialized' });
        }

        const { userId } = req.params;
        const bookings = await bookingsCollection.find({ userId }).toArray();

        res.status(200).json(bookings);

    } catch (error) {
        console.error('🔴 Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ PUT API to Add/Update Event or Venue
app.put('/bookings/:bookingId', async (req, res) => {
    try {
        if (!db || !bookingsCollection) {
            return res.status(500).json({ message: 'Database not initialized' });
        }

        const { bookingId } = req.params;
        const { eventId, eventName, venueId, venueName } = req.body;

        const updateData = {};
        if (eventId) updateData.eventId = eventId;
        if (eventName) updateData.eventName = eventName;
        if (venueId) updateData.venueId = venueId;
        if (venueName) updateData.venueName = venueName;

        const result = await bookingsCollection.updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        res.status(200).json({ message: 'Booking updated successfully' });

    } catch (error) {
        console.error('🔴 Error updating booking:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ PUT API to Confirm Booking (Only if Event & Venue are Set)
app.put('/bookings/confirm/:bookingId', async (req, res) => {
    try {
        if (!db || !bookingsCollection) {
            return res.status(500).json({ message: 'Database not initialized' });
        }

        const { bookingId } = req.params;
        const booking = await bookingsCollection.findOne({ _id: new ObjectId(bookingId) });

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (!booking.eventId || !booking.venueId) {
            return res.status(400).json({ message: 'Event & Venue required before confirmation' });
        }

        await bookingsCollection.updateOne(
            { _id: new ObjectId(bookingId) },
            { $set: { status: 'Confirmed' } }
        );

        res.status(200).json({ message: 'Booking confirmed successfully' });

    } catch (error) {
        console.error('🔴 Error confirming booking:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ DELETE API to Cancel Booking
app.delete('/bookings/:bookingId', async (req, res) => {
    try {
        if (!db || !bookingsCollection) {
            console.error('🔴 Database not initialized');
            return res.status(500).json({ message: 'Database not initialized' });
        }

        const { bookingId } = req.params;
        console.log(`Attempting to delete booking with ID: ${bookingId}`);

        const result = await bookingsCollection.deleteOne({ _id: new ObjectId(bookingId) });

        if (result.deletedCount === 0) {
            console.warn(`🔴 Booking with ID ${bookingId} not found`);
            return res.status(404).json({ message: 'Booking not found' });
        }

        console.log(`🟢 Booking with ID ${bookingId} cancelled successfully`);
        res.status(200).json({ message: 'Booking cancelled successfully' });

    } catch (error) {
        console.error('🔴 Error cancelling booking:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});
