// server.js

const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors'); // Import the cors middleware

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// MongoDB connection
const MONGO_URI = 'mongodb://localhost:27017/contestDB';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Mongoose schema and model for Contest
const contestSchema = new mongoose.Schema({
    name: String,
    platform: String,
    startTime: Date,
    endTime: Date,
    duration: Number,
    link: String,
    past: Boolean,
    solutionLink: String
});

const Contest = mongoose.model('Contest', contestSchema);

// Route to fetch contests from external APIs and store in MongoDB
app.get('/api/contests/fetch', async (req, res) => {
    try {
        // Fetch Codeforces contests
        const codeforcesResponse = await axios.get('https://codeforces.com/api/contest.list');
        const codeforcesContests = codeforcesResponse.data.result.map(contest => {
            const startTime = new Date(contest.startTimeSeconds * 1000);
            const endTime = new Date(startTime.getTime() + contest.durationSeconds * 1000);
            return {
                name: contest.name,
                platform: 'Codeforces',
                startTime: startTime,
                endTime: endTime,
                duration: contest.durationSeconds / 3600, // Convert seconds to hours
                link: `https://codeforces.com/contest/${contest.id}`,
                past: contest.phase === 'FINISHED',
                solutionLink: ''
            };
        });

        // Insert contests into MongoDB if they don't already exist
        for (const contest of codeforcesContests) {
            await Contest.updateOne(
                { name: contest.name, platform: contest.platform },
                { $setOnInsert: contest },
                { upsert: true }
            );
        }

        res.json({ message: 'Contests fetched and stored successfully!' });
    } catch (error) {
        console.error('Error fetching contests:', error);
        res.status(500).json({ error: 'Failed to fetch contests' });
    }
});


// Route to get upcoming contests
app.get('/api/contests/upcoming', async (req, res) => {
    try {
        const now = new Date();
        const upcomingContests = await Contest.find({ startTime: { $gt: now } }).sort({ startTime: 1 });
        res.json(upcomingContests);
    } catch (error) {
        console.error('Error fetching upcoming contests:', error);
        res.status(500).json({ error: 'Failed to fetch upcoming contests' });
    }
});

app.get('/api/contests/past', async (req, res) => {
    try {
        // Fetch the list of contests from Codeforces API
        const response = await axios.get('https://codeforces.com/api/contest.list');

        // Filter contests with phase 'FINISHED' to get past contests
        const pastContests = response.data.result.filter(contest => contest.phase === 'FINISHED');
        console.log("fsil",pastContests)

        // Map the necessary contest details
        const formattedContests = pastContests.map(contest => ({
            id: contest.id,
            name: contest.name,
            startTime: new Date(contest.startTimeSeconds * 1000),
            duration: contest.durationSeconds / 3600, // Convert duration to hours
            link: `https://codeforces.com/contest/${contest.id}`
        }));

        res.json(formattedContests);
    } catch (error) {
        console.error('Error fetching past contests:', error);
        res.status(500).json({ error: 'Failed to fetch past contests' });
    }
});
  
// Route to get stored contests from MongoDB
app.get('/api/contests', async (req, res) => {
    try {
        const contests = await Contest.find();
        res.json(contests);
    } catch (error) {
        console.error('Error retrieving contests:', error);
        res.status(500).json({ error: 'Failed to retrieve contests' });
    }
});

// Route to update solution link for a specific contest
app.post('/api/contests/update-solution', async (req, res) => {
    const { contestId, solutionLink } = req.body;
    try {
        await Contest.findByIdAndUpdate(contestId, { solutionLink });
        res.json({ message: 'Solution link updated successfully!' });
    } catch (error) {
        console.error('Error updating solution link:', error);
        res.status(500).json({ error: 'Failed to update solution link' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
