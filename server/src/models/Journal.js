const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema({
    title: String,
    mood: String,
    content: String
});

const Journal = mongoose.model(
        "Journal",journalSchema
    );

module.exports = Journal;
