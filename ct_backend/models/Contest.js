const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema({
    name: String,
    platform: String,
    startTime: Date,
    duration: Number,
    link: String,
    past: Boolean,
    solutionLink: String
});

// Export using CommonJS
module.exports = mongoose.model("Contest", contestSchema);
    