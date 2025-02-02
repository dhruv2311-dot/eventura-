const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 5173;

// MongoDB connection details
const uri = "mongodb+srv://dhruvsonagra23:dhruv1723@event23.6qktv.mongodb.net/";
const dbName = "eventura";

let db;
let categories,inquiries, reviews, team, venues;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB and Initialize Collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        db = client.db(dbName);
        categories = db.collection('categories');
        inquiries = db.collection('inquiries');
        reviews = db.collection('reviews');
        team = db.collection('team');
        venues = db.collection('venues');

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
initializeDatabase();

// CRUD Routes for Categories

// GET All Categories
app.get('/categories', async (req, res) => {
    try {
        const categoryList = await categories.find().toArray();
        res.status(200).json(categoryList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET a Single Category by ID
app.get('/categories/:id', async (req, res) => {
    try {
        const category = await categories.findOne({ _id: new ObjectId(req.params.id) });
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a New Category
app.post('/categories', async (req, res) => {
    try {
        const newCategory = req.body;

        // Validate input
        if (!newCategory.name || !newCategory.description) {
            return res.status(400).json({ message: 'Name and description are required.' });
        }

        // Insert the new category into the collection
        const result = await categories.insertOne(newCategory);

        // Construct a response using the inserted ID
        res.status(201).json({
            message: 'Category created successfully',
            category: { _id: result.insertedId, ...newCategory },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PUT (Update Entire Category by ID)
app.put('/categories/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({ message: 'Name and description are required.' });
        }
        const result = await categories.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: { name, description } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PATCH (Update Partial Fields of a Category by ID)
app.patch('/categories/:id', async (req, res) => {
    try {
        const updates = req.body;
        const result = await categories.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updates }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE a Category by ID
app.delete('/categories/:id', async (req, res) => {
    try {
        const result = await categories.deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get all venues
app.get('/venues', async (req, res) => {
    try {
        const venueList = await venues.find().toArray();
        res.status(200).json(venueList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single venue by ID
app.get('/venues/:id', async (req, res) => {
    try {
        const venue = await venues.findOne({ _id: new ObjectId(req.params.id) });
        if (!venue) return res.status(404).json({ message: 'Venue not found' });
        res.status(200).json(venue);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new venue
app.post('/venues', async (req, res) => {
    try {
        const newVenue = req.body;

        // Validate required fields
        if (!newVenue.name || !newVenue.location || !newVenue.capacity) {
            return res.status(400).json({ message: 'Name, location, and capacity are required.' });
        }

        const result = await venues.insertOne(newVenue);

        res.status(201).json({
            message: 'Venue created successfully',
            venue: { _id: result.insertedId, ...newVenue },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT (Update Entire Venue by ID)
app.put('/venues/:id', async (req, res) => {
    try {
        const updatedVenue = req.body;

        // Validate required fields
        if (!updatedVenue.name || !updatedVenue.location || !updatedVenue.capacity) {
            return res.status(400).json({ message: 'Name, location, and capacity are required.' });
        }

        const result = await venues.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedVenue }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        res.status(200).json({ message: 'Venue updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PATCH (Update Partial Fields of a Venue by ID)
app.patch('/venues/:id', async (req, res) => {
    try {
        const updates = req.body;

        const result = await venues.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        res.status(200).json({ message: 'Venue updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE a venue by ID
app.delete('/venues/:id', async (req, res) => {
    try {
        const result = await venues.deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        res.status(200).json({ message: 'Venue deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all team members
app.get('/team', async (req, res) => {
    try {
        const teamList = await team.find().toArray();
        res.status(200).json(teamList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single team member by ID
app.get('/team/:id', async (req, res) => {
    try {
        const teamMember = await team.findOne({ _id: new ObjectId(req.params.id) });
        if (!teamMember) return res.status(404).json({ message: 'Team member not found' });
        res.status(200).json(teamMember);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new team member
app.post('/team', async (req, res) => {
    try {
        const newTeamMember = req.body;

        // Validate required fields
        if (!newTeamMember.name || !newTeamMember.role || !newTeamMember.experience) {
            return res.status(400).json({ message: 'Name, role, and experience are required.' });
        }

        const result = await team.insertOne(newTeamMember);

        res.status(201).json({
            message: 'Team member created successfully',
            teamMember: { _id: result.insertedId, ...newTeamMember },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT (Update Entire Team Member by ID)
app.put('/team/:id', async (req, res) => {
    try {
        const updatedTeamMember = req.body;

        // Validate required fields
        if (!updatedTeamMember.name || !updatedTeamMember.role || !updatedTeamMember.experience) {
            return res.status(400).json({ message: 'Name, role, and experience are required.' });
        }

        const result = await team.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedTeamMember }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        res.status(200).json({ message: 'Team member updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PATCH (Update Partial Fields of a Team Member by ID)
app.patch('/team/:id', async (req, res) => {
    try {
        const updates = req.body;

        const result = await team.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        res.status(200).json({ message: 'Team member updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE a team member by ID
app.delete('/team/:id', async (req, res) => {
    try {
        const result = await team.deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        res.status(200).json({ message: 'Team member deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all inquiries
app.get('/inquiries', async (req, res) => {
    try {
        const inquiriesList = await inquiries.find().toArray();
        res.status(200).json(inquiriesList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single inquiry by ID
app.get('/inquiries/:id', async (req, res) => {
    try {
        const inquiry = await inquiries.findOne({ _id: new ObjectId(req.params.id) });
        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
        res.status(200).json(inquiry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new inquiry
app.post('/inquiries', async (req, res) => {
    try {
        const newInquiry = req.body;

        // Validate required fields
        if (!newInquiry.name || !newInquiry.email || !newInquiry.message) {
            return res.status(400).json({ message: 'Name, email, and message are required.' });
        }

        const result = await inquiries.insertOne(newInquiry);

        res.status(201).json({
            message: 'Inquiry created successfully',
            inquiry: { _id: result.insertedId, ...newInquiry },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT (Update Entire Inquiry by ID)
app.put('/inquiries/:id', async (req, res) => {
    try {
        const updatedInquiry = req.body;

        // Validate required fields
        if (!updatedInquiry.name || !updatedInquiry.email || !updatedInquiry.message) {
            return res.status(400).json({ message: 'Name, email, and message are required.' });
        }

        const result = await inquiries.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedInquiry }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        res.status(200).json({ message: 'Inquiry updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PATCH (Update Partial Fields of an Inquiry by ID)
app.patch('/inquiries/:id', async (req, res) => {
    try {
        const updates = req.body;

        const result = await inquiries.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        res.status(200).json({ message: 'Inquiry updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE an inquiry by ID
app.delete('/inquiries/:id', async (req, res) => {
    try {
        const result = await inquiries.deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Inquiry not found' });
        }

        res.status(200).json({ message: 'Inquiry deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all reviews
app.get('/reviews', async (req, res) => {
    try {
        const reviewsList = await reviews.find().toArray();
        res.status(200).json(reviewsList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a single review by ID
app.get('/reviews/:id', async (req, res) => {
    try {
        const review = await reviews.findOne({ _id: new ObjectId(req.params.id) });
        if (!review) return res.status(404).json({ message: 'Review not found' });
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new review
app.post('/reviews', async (req, res) => {
    try {
        const newReview = req.body;

        // Validate required fields
        if (!newReview.name || !newReview.email || !newReview.rating || !newReview.comment) {
            return res.status(400).json({ message: 'Name, email, rating, and comment are required.' });
        }

        const result = await reviews.insertOne(newReview);

        res.status(201).json({
            message: 'Review created successfully',
            review: { _id: result.insertedId, ...newReview },
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT (Update Entire Review by ID)
app.put('/reviews/:id', async (req, res) => {
    try {
        const updatedReview = req.body;

        // Validate required fields
        if (!updatedReview.name || !updatedReview.email || !updatedReview.rating || !updatedReview.comment) {
            return res.status(400).json({ message: 'Name, email, rating, and comment are required.' });
        }

        const result = await reviews.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updatedReview }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({ message: 'Review updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PATCH (Update Partial Fields of a Review by ID)
app.patch('/reviews/:id', async (req, res) => {
    try {
        const updates = req.body;

        const result = await reviews.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({ message: 'Review updated successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE a review by ID
app.delete('/reviews/:id', async (req, res) => {
    try {
        const result = await reviews.deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Review not found' });
        }

        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

