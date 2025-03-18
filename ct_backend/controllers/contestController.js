const axios = require("axios");
const Contest = require("../models/Contest.js");

// Fetch contests from APIs
const fetchContests = async (req, res) => {
    console.log('hello')
    
    try {
        // Fetch Codeforces contests
        const codeforces = await axios.get("https://codeforces.com/api/contest.list");

        // Fetch LeetCode contests using GraphQL API
        const leetcodeResponse = await axios.post("https://leetcode.com/graphql", {
            query: `
                query {
                    contestUpcoming {
                        title
                        startTime
                        duration
                        titleSlug
                    }
                }
            `
        });

        // Parse LeetCode response
        const leetcodeContests = leetcodeResponse.data.data.contestUpcoming.map(contest => ({
            name: contest.title,
            platform: "LeetCode",
            startTime: new Date(contest.startTime * 1000),
            duration: contest.duration / 3600, // Convert seconds to hours
            link: `https://leetcode.com/contest/${contest.titleSlug}`,
            past: false,
            solutionLink: ""
        }));

        // Parse Codeforces response
        const codeforcesContests = codeforces.data.result.map(contest => ({
            name: contest.name,
            platform: "Codeforces",
            startTime: new Date(contest.startTimeSeconds * 1000),
            duration: contest.durationSeconds / 3600,
            link: `https://codeforces.com/contest/${contest.id}`,
            past: contest.phase === "FINISHED",
            solutionLink: ""
        }));

        // Merge contests
        const allContests = [...leetcodeContests, ...codeforcesContests];

        // Save to MongoDB
        await Contest.insertMany(allContests);
        res.json({ message: "Contests fetched and stored!" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

// Get contests from DB
const getContests = async (req, res) => {
    try {
        const contests = await Contest.find();
        res.json(contests);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update solution link for past contests
const updateSolutionLink = async (req, res) => {
    const { contestId, link } = req.body;
    try {
        await Contest.findByIdAndUpdate(contestId, { solutionLink: link });
        res.json({ message: "Solution link updated!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Export functions in CommonJS format
module.exports = { fetchContests, getContests, updateSolutionLink };
