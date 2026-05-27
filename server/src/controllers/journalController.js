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


function getAllJournals(req, res) {
    return res.json(journals);
}

function getJournalById(req, res) {
    const journalId = Number(req.params.id);
    const journal = journals.find(j => j.id === journalId);
    if (!journal) {
        return res.status(404).json({ error: "Journal not found" });
    }
    return res.json(journal);
}

function createJournal(req, res) {

    const body = req.body;
    const newJournal = {
        id: journals.length + 1,
        title: body.title,
        mood: body.mood,
        content: body.content
    };
    journals.push(newJournal);
    return res.status(201).json(newJournal)

}


function updateJournal(req, res) {
    const patchId = Number(req.params.id)

    const journal = journals.find(j => j.id === patchId);
    if (!journal) {
        return res.status(404).json({ error: "Journal not found" });
    }

    // Update only provided fields (PATCH behavior)
    Object.assign(journal, req.body);

    // Return updated journal
    return res.status(200).json(journal);
}

function deleteJournal(req, res) {
    const deleteId = Number(req.params.id);

    // Find index of matching journal
    const journalIndex = journals.findIndex(j => j.id === deleteId);

    // If journal doesn't exist
    if (journalIndex === -1) {
        return res.status(404).json({ error: "Journal not found" });
    }

    // Remove journal from array
    const deletedJournal = journals.splice(journalIndex, 1);

    // Return deleted journal
    return res.status(200).json({
        message: "Journal deleted successfully",
        deleted: deletedJournal[0]
    });
}
module.exports = {
    getAllJournals,
    getJournalById,
    createJournal,
    updateJournal,
    deleteJournal
};