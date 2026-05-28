const Journal = require("../models/Journal");

async function getAllJournals(req, res) {
  try {
    const journals = await Journal.find();
    return res.json(journals);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch journals",
    });
  }
}

async function getJournalById(req, res) {
  try {
    const id = req.params.id;

    const journal = await Journal.findById(id);

    if (!journal) {
      return res.status(404).json({
        error: "No Journal Found",
      });
    }

    return res.json(journal);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch journal",
    });
  }
}

async function createJournal(req, res) {
  try {
    const body = req.body;

    const newJournal = await Journal.create({
      title: body.title,
      mood: body.mood,
      content: body.content,
    });

    return res.status(201).json(newJournal);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to create journal",
    });
  }
}

async function updateJournal(req, res) {
  try {
    const patchId = req.params.id;

    const journal = await Journal.findByIdAndUpdate(patchId, req.body, {
      new: true,
    });
    if (!journal) {
      return res.status(404).json({ error: "Journal not found" });
    }
    return res.status(200).json(journal);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to update journal",
    });
  }
}

async function deleteJournal(req, res) {
  try {
    const id = req.params.id;

    const journal = await Journal.findByIdAndDelete(id);

    if (!journal) {
      return res.status(404).json({
        error: "Journal not found",
      });
    }

    return res.status(200).json({
      message: "Journal deleted successfully",
      deleted: journal,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to delete journal",
    });
  }
}
module.exports = {
  getAllJournals,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
};
