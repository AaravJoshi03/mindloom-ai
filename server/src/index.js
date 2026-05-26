const express = require("express");
const app = express();
const PORT = 8000;

// Middleware for post req , req.body
app.use(express.json());




// Temporary journal data stored in memory
// Later this will move to MongoDB
const journals = [
    {
        id: 1,
        title: "Good day",
        mood: "Happy",
        content: "Completed Node.js practice and felt productive"
    },

    {
        id: 2,
        title: "Stressful day",
        mood: "Tired",
        content: "Had many tasks and felt overwhelmed"
    }
];


// Root route → checks whether backend is running
app.get('/', (req, res) => {
    return res.send("Mindloom backend running");
});


// Health route → used by monitoring/deployment tools
// Returns server status as JSON
app.get('/health', (req, res) => {
    return res.json({ status: "OK" });
});


// Returns all journal entries stored in memory
// Later this data will come from MongoDB
app.get('/api/journals', (req, res) => {
    return res.json(journals);
});
// Returns a single journal entry by ID
app.get('/api/journals/:id', (req, res) => {
    const journalId = Number(req.params.id);
    const journal = journals.find(j => j.id === journalId);
    if (!journal) {
        return res.status(404).json({ error: "Journal not found" });
    }
    return res.json(journal);
});

// post req
app.post('/api/journals', (req, res) => {
    // post ka json formatted response in body var
    const body = req.body;
    const newJournal = {
        id: journals.length + 1,
        title: body.title,
        mood: body.mood,
        content: body.content
    };
    journals.push(newJournal);
    return res.status(201).json(newJournal)
});


app.patch('/api/journals/:id',(req,res) => {
    const patchId = Number(req.params.id)

    const journal = journals.find(j => j.id === patchId);
    if (!journal) {
        return res.status(404).json({ error: "Journal not found" });
    }

    // Update only provided fields (PATCH behavior)
    Object.assign(journal, req.body);

    // Return updated journal
    return res.status(200).json(journal);
});

// Delete a journal entry by ID
app.delete('/api/journals/:id', (req, res) => {

    const deleteId = Number(req.params.id);

    // Find index of matching journal
    const journalIndex = journals.findIndex(j => j.id === deleteId);

    // If journal doesn't exist
    if (!journalIndex) {
        return res.status(404).json({ error: "Journal not found" });
    }

    // Remove journal from array
    const deletedJournal = journals.splice(journalIndex, 1);

    // Return deleted journal
    return res.status(200).json({
        message: "Journal deleted successfully",
        deleted: deletedJournal[0]
    });
});

// Start backend server and listen for requests
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});