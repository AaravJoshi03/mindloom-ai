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

async function generateWeeklyReflection(combinedContent) {
  const prompt = `
You are an AI wellness coach.

Analyze the following journal entries from the past week.

Journal Entries:
${combinedContent}

Return ONLY valid JSON.

{
  "overallMood": "",
  "summary": "",
  "wins": [],
  "growthAreas": [],
  "weeklyAdvice": ""
}

Rules:
- overallMood should be one word
- summary should be 2-3 sentences
- wins should contain 3 points
- growthAreas should contain 3 points
- weeklyAdvice should be practical

IMPORTANT:
Return raw JSON only.
Do not use markdown.
Do not use \`\`\`json.
Do not add explanations.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const reflection = JSON.parse(response.text);

  return reflection;
}
module.exports = {
  analyzeJournal,
  generateWeeklyReflection,
};
