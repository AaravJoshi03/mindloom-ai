const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const journalController = require("../controllers/journalController");

router.get("/", authMiddleware, journalController.getAllJournals);

router.get("/stats", authMiddleware, journalController.getStats);

router.get("/search", authMiddleware, journalController.searchJournals);

router.get("/trends", authMiddleware, journalController.getTrends);

router.get(
  "/weekly-reflection",
  authMiddleware,
  journalController.getWeeklyReflection,
);

router.get("/:id", authMiddleware, journalController.getJournalById);

router.post("/", authMiddleware, journalController.createJournal);

router.patch("/:id", authMiddleware, journalController.updateJournal);

router.delete("/:id", authMiddleware, journalController.deleteJournal);

module.exports = router;
