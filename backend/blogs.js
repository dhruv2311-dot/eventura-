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
let blogsCollection;

// Connect to MongoDB and Initialize Collections
async function initializeDatabase() {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log('🟢 Connected to MongoDB');

        db = client.db(dbName);
        blogsCollection = db.collection('blogs');

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


// 📌 **1. GET All Blogs**
app.get('/blogs', async (req, res) => {
    try {
        if (!db || !blogsCollection) {
            return res.status(500).json({ message: "Database not initialized" });
        }

        const blogs = await blogsCollection.find({}).toArray();
        res.status(200).json(blogs);

    } catch (error) {
        console.error("🔴 Error fetching blogs:", error);
        res.status(500).json({ message: "Server error", error });
    }
});