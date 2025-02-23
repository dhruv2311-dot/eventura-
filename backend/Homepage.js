const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 5173;
app.use(cors());
// MongoDB connection details
const uri = "mongodb+srv://dhruvsonagra23:dhruv1723@event23.6qktv.mongodb.net/";
const dbName = "eventura";

let db;
let categories, inquiries, reviews, team, venues;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB and Initialize Collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');

        db = client.db(dbName);
        categoriesCollection = db.collection('categories');
        inquiries = db.collection('inquiries');
        reviews = db.collection('reviews');
        team = db.collection('team');
        venuesCollection = db.collection('venues');

        defineRoutes();

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}
initializeDatabase();

// ✅ GET All Categories
function defineRoutes() {

    // ✅ GET All Categories
    app.get('/categories', async (req, res) => {
        try {
            const categories = await categoriesCollection.find().toArray();
            res.status(200).json(categories);
        } catch (error) {
            console.error("🔴 Error fetching categories:", error.message, error.stack);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // ✅ GET Category by ID
    app.get('/categories/:id', async (req, res) => {
        try {
            const categoryId = req.params.id;

            if (!ObjectId.isValid(categoryId)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }

            const category = await categoriesCollection.findOne({ _id: new ObjectId(categoryId) });

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            res.status(200).json(category);
        } catch (error) {
            console.error("🔴 Error fetching category:", error.message, error.stack);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // ✅ POST Create New Category
    app.post('/categories', async (req, res) => {
        try {
            const { name, description, image_url, key_highlights, services, featured_images, additional_info } = req.body;

            if (!name || !description || !image_url) {
                return res.status(400).json({ message: "Name, description, and image URL are required" });
            }

            const newCategory = {
                name,
                description,
                image_url,
                key_highlights: key_highlights || [],
                services: services || [],
                featured_images: featured_images || [],
                additional_info: additional_info || ""
            };

            const result = await categoriesCollection.insertOne(newCategory);
            res.status(201).json({ message: "Category created successfully", categoryId: result.insertedId });

        } catch (error) {
            console.error("🔴 Error creating category:", error.message, error.stack);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // ✅ PUT Update Entire Category
    app.put('/categories/:id', async (req, res) => {
        try {
            const categoryId = req.params.id;
            const { name, description, image_url, key_highlights, services, featured_images, additional_info } = req.body;

            if (!ObjectId.isValid(categoryId)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }

            if (!name || !description || !image_url) {
                return res.status(400).json({ message: "Name, description, and image URL are required" });
            }

            const updatedCategory = {
                name,
                description,
                image_url,
                key_highlights: key_highlights || [],
                services: services || [],
                featured_images: featured_images || [],
                additional_info: additional_info || ""
            };

            const result = await categoriesCollection.replaceOne(
                { _id: new ObjectId(categoryId) },
                updatedCategory
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "Category not found or not modified" });
            }

            res.status(200).json({ message: "Category updated successfully" });

        } catch (error) {
            console.error("🔴 Error updating category:", error.message, error.stack);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // ✅ PATCH Update Partial Category
    app.patch('/categories/:id', async (req, res) => {
        try {
            const categoryId = req.params.id;
            const updates = req.body;

            if (!ObjectId.isValid(categoryId)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }

            const result = await categoriesCollection.updateOne(
                { _id: new ObjectId(categoryId) },
                { $set: updates }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ message: "Category not found or not modified" });
            }

            res.status(200).json({ message: "Category updated successfully" });

        } catch (error) {
            console.error("🔴 Error updating category:", error.message, error.stack);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });

    // ✅ DELETE Category by ID
    app.delete('/categories/:id', async (req, res) => {
        try {
            const categoryId = req.params.id;

            if (!ObjectId.isValid(categoryId)) {
                return res.status(400).json({ message: "Invalid category ID" });
            }

            const result = await categoriesCollection.deleteOne({ _id: new ObjectId(categoryId) });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "Category not found" });
            }

            res.status(200).json({ message: "Category deleted successfully" });

        } catch (error) {
            console.error("🔴 Error deleting category:", error.message, error.stack);
            res.status(500).json({ message: "Server error", error: error.message });
        }
    });


// Get all venues
app.get('/venues', async (req, res) => {
    try {
        const venues = await venuesCollection.find().toArray();
        res.status(200).json(venues);
    } catch (error) {
        console.error("🔴 Error fetching venues:", error.message, error.stack);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ GET Venue by ID
app.get('/venues/:id', async (req, res) => {
    try {
        const venueId = req.params.id;

        if (!ObjectId.isValid(venueId)) {
            return res.status(400).json({ message: "Invalid venue ID" });
        }

        const venue = await venuesCollection.findOne({ _id: new ObjectId(venueId) });

        if (!venue) {
            return res.status(404).json({ message: "Venue not found" });
        }

        res.status(200).json(venue);
    } catch (error) {
        console.error("🔴 Error fetching venue:", error.message, error.stack);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ POST Create New Venue
app.post('/venues', async (req, res) => {
    try {
        const { name, location, capacity, price_per_day, images, description, key_highlights, services, additional_info } = req.body;

        if (!name || !location || !capacity || !price_per_day || !images || !description) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newVenue = {
            name,
            location,
            capacity,
            price_per_day,
            images,
            description,
            key_highlights: key_highlights || [],
            services: services || [],
            additional_info: additional_info || ""
        };

        const result = await venuesCollection.insertOne(newVenue);
        res.status(201).json({ message: "Venue created successfully", venueId: result.insertedId });

    } catch (error) {
        console.error("🔴 Error creating venue:", error.message, error.stack);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ PUT Update Entire Venue
app.put('/venues/:id', async (req, res) => {
    try {
        const venueId = req.params.id;
        const { name, location, capacity, price_per_day, images, description, key_highlights, services, additional_info } = req.body;

        if (!ObjectId.isValid(venueId)) {
            return res.status(400).json({ message: "Invalid venue ID" });
        }

        if (!name || !location || !capacity || !price_per_day || !images || !description) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const updatedVenue = {
            name,
            location,
            capacity,
            price_per_day,
            images,
            description,
            key_highlights: key_highlights || [],
            services: services || [],
            additional_info: additional_info || ""
        };

        const result = await venuesCollection.replaceOne(
            { _id: new ObjectId(venueId) },
            updatedVenue
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Venue not found or not modified" });
        }

        res.status(200).json({ message: "Venue updated successfully" });

    } catch (error) {
        console.error("🔴 Error updating venue:", error.message, error.stack);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ PATCH Update Partial Venue
app.patch('/venues/:id', async (req, res) => {
    try {
        const venueId = req.params.id;
        const updates = req.body;

        if (!ObjectId.isValid(venueId)) {
            return res.status(400).json({ message: "Invalid venue ID" });
        }

        const result = await venuesCollection.updateOne(
            { _id: new ObjectId(venueId) },
            { $set: updates }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Venue not found or not modified" });
        }

        res.status(200).json({ message: "Venue updated successfully" });

    } catch (error) {
        console.error("🔴 Error updating venue:", error.message, error.stack);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ DELETE Venue by ID
app.delete('/venues/:id', async (req, res) => {
    try {
        const venueId = req.params.id;

        if (!ObjectId.isValid(venueId)) {
            return res.status(400).json({ message: "Invalid venue ID" });
        }

        const result = await venuesCollection.deleteOne({ _id: new ObjectId(venueId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Venue not found" });
        }

        res.status(200).json({ message: "Venue deleted successfully" });

    } catch (error) {
        console.error("🔴 Error deleting venue:", error.message, error.stack);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
}
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

