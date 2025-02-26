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