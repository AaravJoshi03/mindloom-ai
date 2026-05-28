const express = require("express");
const app = express();
const PORT = 8000;

const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/mindloom")
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((error) => {
        console.log("MongoDB Error:", error);
    });

    
const journalRoutes =
    require("./routes/journalRoutes");

app.use(express.json());

app.use('/api/journals', journalRoutes);


// Backend check
app.get('/', (req, res) => {
    return res.send("Mindloom backend running");
});


// Health check
app.get('/health', (req, res) => {
    return res.json({
        status: "OK"
    });
});


app.listen(PORT, () => {
    console.log(
        `Server running on ${PORT}`
    );
});