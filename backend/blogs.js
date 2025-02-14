const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require("cors");
const app = express();
const port = 8000;
app.use(cors());
// MongoDB connection details
const uri = "mongodb+srv://dhruvsonagra23:dhruv1723@event23.6qktv.mongodb.net/";
const dbName = "eventura";

let db;
let blogsCollection;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB and Initialize Collections
async function initializeDatabase() {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('🟢 Connected to MongoDB');

        db = client.db(dbName);
        blogsCollection = db.collection('blogs');

        app.listen(port, () => {
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('🔴 Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
initializeDatabase();


app.get("/blogs", async (req, res) => {
    try {
        const blogs = await blogsCollection.find().toArray();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.get("/blogs/:id", async (req, res) => {
    try {
        const blog = await blogsCollection.findOne({ _id: new ObjectId(req.params.id) });
        if (!blog) return res.status(404).json({ message: "Blog not found" });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.post("/blogs", async (req, res) => {
    try {
        const { title, author, date, category, image, content, status } = req.body;
        if (!title || !author || !content) return res.status(400).json({ message: "Missing required fields" });

        const newBlog = { title, author, date, category, image, content, status };
        const result = await blogsCollection.insertOne(newBlog);
        res.status(201).json({ message: "Blog created", blog: newBlog });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.put("/blogs/:id", async (req, res) => {
    try {
        const { title, author, date, category, image, content, status } = req.body;
        const updatedBlog = { title, author, date, category, image, content, status };
        const result = await blogsCollection.replaceOne({ _id: new ObjectId(req.params.id) }, updatedBlog);
        if (result.matchedCount === 0) return res.status(404).json({ message: "Blog not found" });

        res.json({ message: "Blog replaced successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.patch("/blogs/:id", async (req, res) => {
    try {
        const updates = req.body;
        const result = await blogsCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });
        if (result.matchedCount === 0) return res.status(404).json({ message: "Blog not found" });

        res.json({ message: "Blog updated successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.delete("/blogs/:id", async (req, res) => {
    try {
        const result = await blogsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: "Blog not found" });

        res.json({ message: "Blog deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
