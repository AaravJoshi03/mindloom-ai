const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function analyzeJournal(title, content) {
  const prompt = `
You are an AI mental wellness assistant.

Analyze the journal entry below.

Title:
${title}

Content:
${content}

Return ONLY a valid JSON object with the following structure:

{
  "detectedMood": "",
  "stressLevel": 0,
  "sentimentScore": 0,
  "summary": "",
  "reflection": "",
  "positiveObservations": [],
  "areasOfConcern": [],
  "suggestions": [],
  "keywords": []
}

Rules:
- detectedMood must be one of: Happy, Sad, Anxious, Angry, Stressed, Excited, Motivated, Confused, Neutral
- stressLevel must be an integer between 1 and 10
- sentimentScore must be an integer between 1 and 10
- suggestions must contain exactly 3 actionable suggestions
- keywords must contain 3 to 5 keywords
- positiveObservations must be an array
- areasOfConcern must be an array

IMPORTANT:
- Return exactly ONE JSON object
- Return raw JSON only
- Do not use markdown formatting
- Do not include explanations
- Do not include notes
- Do not include text before or after the JSON
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  try {
    const analysis = JSON.parse(response.text);
    return analysis;
  } catch (error) {
    console.error("Failed to parse Gemini response:", response.text);
    throw new Error("AI analysis failed");
  }
}

module.exports = {
  analyzeJournal,
};
