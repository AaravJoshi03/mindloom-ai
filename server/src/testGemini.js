require("dotenv").config();

const { analyzeJournal } = require("./services/geminiService");

async function test() {
  const result = await analyzeJournal(
    "Placement Stress",
    "I am worried about interviews and my future.",
  );

  console.log(result);
}

test();
