const Journal = require("../models/Journal");
const {
  analyzeJournal,
  generateWeeklyReflection,
} = require("../services/geminiService");

async function getAllJournals(req, res) {
  try {
    const journals = await Journal.find({
      user: req.user._id,
    }).populate("user", "name email");

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

    const journal = await Journal.findOne({
      _id: id,
      user: req.user._id,
    }).populate("user", "name email");

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
    const analysis = await analyzeJournal(title, content);

    const newJournal = await Journal.create({
      title,
      mood,
      content,
      user: req.user._id,

      aiStatus: "completed",
      aiAnalysis: analysis,
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

    const journal = await Journal.findOneAndUpdate(
      {
        _id: id,
        user: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      },
    ).populate("user", "name email");

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

    const journal = await Journal.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

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

async function getStats(req, res) {
  try {
    const journals = await Journal.find({
      user: req.user._id,
    });

    const totalJournals = journals.length;

    let totalStress = 0;
    let totalSentiment = 0;

    let stressCount = 0;
    let sentimentCount = 0;

    const moodMap = {};
    const aiMoodMap = {};

    let alignmentMatches = 0;

    for (const journal of journals) {
      // Stress
      if (journal.aiAnalysis?.stressLevel) {
        totalStress += journal.aiAnalysis.stressLevel;
        stressCount++;
      }

      // Sentiment
      if (journal.aiAnalysis?.sentimentScore) {
        totalSentiment += journal.aiAnalysis.sentimentScore;
        sentimentCount++;
      }

      // User Mood Frequency
      if (moodMap[journal.mood]) {
        moodMap[journal.mood]++;
      } else {
        moodMap[journal.mood] = 1;
      }

      // AI Mood Frequency
      const aiMood = journal.aiAnalysis?.detectedMood;

      if (aiMood) {
        if (aiMoodMap[aiMood]) {
          aiMoodMap[aiMood]++;
        } else {
          aiMoodMap[aiMood] = 1;
        }
      }

      if (journal.mood === journal.aiAnalysis?.detectedMood) {
        alignmentMatches++;
      }
    }

    const averageStress = stressCount > 0 ? totalStress / stressCount : 0;

    const averageSentiment =
      sentimentCount > 0 ? totalSentiment / sentimentCount : 0;

    const moodAlignmentPercentage =
      totalJournals > 0 ? (alignmentMatches / totalJournals) * 100 : 0;

    let mostCommonUserMood = "";
    let highestCount = 0;

    for (const mood in moodMap) {
      if (moodMap[mood] > highestCount) {
        highestCount = moodMap[mood];
        mostCommonUserMood = mood;
      }
    }

    let mostCommonAIMood = "";
    let highestAICount = 0;

    for (const mood in aiMoodMap) {
      if (aiMoodMap[mood] > highestAICount) {
        highestAICount = aiMoodMap[mood];
        mostCommonAIMood = mood;
      }
    }

    return res.status(200).json({
      success: true,
      data: {
        totalJournals,
        averageStress,
        averageSentiment,
        mostCommonUserMood,
        mostCommonAIMood,
        moodAlignmentPercentage,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function searchJournals(req, res) {
  try {
    const searchTerm = req.query.q;

    const journals = await Journal.find({
      user: req.user._id,
      $or: [
        {
          title: {
            $regex: searchTerm,
            $options: "i",
          },
        },
        {
          content: {
            $regex: searchTerm,
            $options: "i",
          },
        },
      ],
    });

    return res.status(200).json({
      success: true,
      count: journals.length,
      data: journals,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getTrends(req, res) {
  try {
    const journals = await Journal.find({
      user: req.user._id,
    }).sort({ createdAt: 1 });

    const stressTrend = [];
    const sentimentTrend = [];
    const moodTrend = [];
    for (const journal of journals) {
      stressTrend.push({
        date: journal.createdAt,
        stressLevel: journal.aiAnalysis?.stressLevel || null,
      });
      sentimentTrend.push({
        date: journal.createdAt,
        sentimentScore: journal.aiAnalysis?.sentimentScore || null,
      });

      moodTrend.push({
        date: journal.createdAt,
        mood: journal.mood,
        aiMood: journal.aiAnalysis?.detectedMood || null,
      });
    }
    return res.status(200).json({
      success: true,
      data: {
        stressTrend,
        sentimentTrend,
        moodTrend,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

async function getWeeklyReflection(req, res) {
  try {
    const journals = await Journal.find({
      user: req.user._id,
    });
    let combinedContent = "";
    for (const journal of journals) {
      combinedContent += journal.content + "\n\n";
    }
    const reflection = await generateWeeklyReflection(combinedContent);
    return res.status(200).json({
      success: true,
      data: reflection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

module.exports = {
  getAllJournals,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
  getStats,
  searchJournals,
  getTrends,
  getWeeklyReflection,
};
