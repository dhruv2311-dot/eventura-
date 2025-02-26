const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5173;

app.use(cors());
app.use(express.json());

// MongoDB connection details
const uri = "mongodb+srv://dhruvsonagra23:dhruv1723@event23.6qktv.mongodb.net/";
const dbName = "eventura";

let db;
let projects;

// Connect to MongoDB and Initialize Collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        db = client.db(dbName);
        projects = db.collection('projects');

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
initializeDatabase();

// Get all projects
app.get('/projects', async (req, res) => {
    try {
        const projectList = await projects.find().toArray();
        res.status(200).json(projectList);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// Get a project by ID
app.get('/projects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const project = await projects.findOne({ _id: new ObjectId(id) });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID format' });
    }
});
app.get('/projects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const project = await projects.findOne({ _id: new ObjectId(id) });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID format' });
    }
});

// Add a new project
app.post('/projects', async (req, res) => {
    try {
        const newProject = req.body;
        const result = await projects.insertOne(newProject);
        res.status(201).json({ message: 'Project created', projectId: result.insertedId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// Update a project by replacing it entirely
app.put('/projects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedProject = req.body;

        const result = await projects.replaceOne({ _id: new ObjectId(id) }, updatedProject);

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Project updated' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID format' });
    }
});

// Update specific fields of a project
app.patch('/projects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateFields = req.body;

        const result = await projects.updateOne({ _id: new ObjectId(id) }, { $set: updateFields });

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Project updated' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID format' });
    }
});

// Delete a project by ID
app.delete('/projects/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await projects.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.status(200).json({ message: 'Project deleted' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid ID format' });
    }
});