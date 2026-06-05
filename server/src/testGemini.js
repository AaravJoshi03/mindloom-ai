require("dotenv").config();

const { generateWeeklyReflection } = require("./services/geminiService");

async function test() {
  const combinedContent = `
I am worried about placements and interviews.

Today I felt much better after solving DSA problems.

I still compare myself with others and sometimes feel behind.
`;

  const reflection = await generateWeeklyReflection(combinedContent);

  console.log(reflection);
}

test();
