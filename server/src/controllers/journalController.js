const Journal = require("../models/Journal");

async function getAllJournals(req, res) {
  try {
    const journals = await Journal.find();

    return res.status(200).json({
      success: true,
      count: journals.length,
      data: journals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch journals",
      error: error.message,
    });
  }
}

async function getJournalById(req, res) {
  try {
    const id = req.params.id;

    const journal = await Journal.findById(id);

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Journal not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: journal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch journal",
      error: error.message,
    });
  }
}

async function createJournal(req, res) {
  try {
    const { title, mood, content } = req.body;

    const newJournal = await Journal.create({
      title,
      mood,
      content,
    });

    return res.status(201).json({
      success: true,
      message: "Journal created successfully",
      data: newJournal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function updateJournal(req, res) {
  try {
    const id = req.params.id;

    const journal = await Journal.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Journal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Journal updated successfully",
      data: journal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update journal",
      error: error.message,
    });
  }
}

async function deleteJournal(req, res) {
  try {
    const id = req.params.id;

    const journal = await Journal.findByIdAndDelete(id);

    if (!journal) {
      return res.status(404).json({
        success: false,
        message: "Journal not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Journal deleted successfully",
      deleted: journal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete journal",
      error: error.message,
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
