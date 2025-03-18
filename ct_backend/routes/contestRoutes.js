const express = require("express");
const { fetchContests, getContests, updateSolutionLink } = require("../controllers/contestController");


const router = express.Router();
router.get("/fetch", fetchContests);  // Fetch and store contests
// router.get("/", getContests);         // Get stored contests
// router.post("/update-solution", updateSolutionLink); // Admin: Add solution links

module.exports = router;
