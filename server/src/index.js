require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT;

const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB Error:", error);
  });

app.use(express.json());

// Journal routes
const journalRoutes = require("./routes/journalRoutes");
app.use("/api/journals", journalRoutes);

// Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// Backend check
app.get("/", (req, res) => {
  return res.send("Mindloom backend running");
});

// Health check
app.get("/health", (req, res) => {
  return res.json({
    status: "OK",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
