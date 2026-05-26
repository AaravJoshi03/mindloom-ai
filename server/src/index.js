const express = require("express");
const app = express();
const PORT = 8000;

app.get('/', (req, res) => {
    return res.send("Mindloom backend running");
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});