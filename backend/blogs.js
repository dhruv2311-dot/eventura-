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

// 📌 **2. GET Single Blog by ID**
app.get('/blogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid blog ID" });
        }

        const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        if (blog.video && blog.video.includes("watch?v=")) {
            blog.video = blog.video.replace("watch?v=", "embed/");
          }
        res.status(200).json(blog);

    } catch (error) {
        console.error("🔴 Error fetching blog:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// 📌 **3. POST (Create New Blog)**
app.post('/blogs', async (req, res) => {
    try {
        if (!db || !blogsCollection) {
            return res.status(500).json({ message: "Database not initialized" });
        }

        const { title, author, date, category, image, content, video, video_description, additional_images } = req.body;

        // Validate required fields
        if (!title || !author || !date || !category || !image || !content) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newBlog = { title, author, date, category, image, content, video, video_description, additional_images, status: "published" };
        const result = await blogsCollection.insertOne(newBlog);

        res.status(201).json({ message: "Blog created successfully", blogId: result.insertedId });

    } catch (error) {
        console.error("🔴 Error creating blog:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// 📌 **4. PUT (Update Entire Blog)**
app.put('/blogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid blog ID" });
        }

        const { title, author, date, category, image, content, video, video_description, additional_images } = req.body;

        if (!title || !author || !date || !category || !image || !content) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const updatedBlog = { title, author, date, category, image, content, video, video_description, additional_images, status: "published" };
        const result = await blogsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedBlog });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Blog not found or no changes made" });
        }

        res.status(200).json({ message: "Blog updated successfully" });

    } catch (error) {
        console.error("🔴 Error updating blog:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// 📌 **5. PATCH (Update Partial Blog Data)**
app.patch('/blogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid blog ID" });
        }

        const updateFields = req.body;
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: "No fields provided for update" });
        }

        const result = await blogsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Blog not found or no changes made" });
        }

        res.status(200).json({ message: "Blog updated successfully" });

    } catch (error) {
        console.error("🔴 Error updating blog:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// 📌 **6. DELETE (Remove a Blog)**
app.delete('/blogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid blog ID" });
        }

        const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json({ message: "Blog deleted successfully" });

    } catch (error) {
        console.error("🔴 Error deleting blog:", error);
        res.status(500).json({ message: "Server error", error });
    }
});
