const { GoogleGenerativeAI } = require("@google/generative-ai");


// Initialize Gemini with your API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

const generateRoadmapJSON = async (topic) => {
  const prompt = `
    You are an educational architect. Create a learning path for the topic: "${topic}".
    Output strictly valid JSON.
    Structure the output as a Graph with 'nodes' and 'edges'.
    
    1. 'nodes': Array of objects. Each node must have:
       - "id": String (use "1", "2", etc.)
       - "title": String (Short concept name)
       - "description": String (Brief explanation)
       - "xpReward": Integer (Difficulty level: 10-100)
       - "positionX": Integer (Optional, for now just put 0)
       - "positionY": Integer (Optional, for now just put 0)
    
    2. 'edges': Array of objects. Each edge must have:
       - "source": String (The id of the prerequisite node)
       - "target": String (The id of the next node)
    
    Start with basics (Root node) and progress to advanced concepts.
    Create at least 5-7 nodes.
    IMPORTANT: Return ONLY the JSON. Do not include markdown formatting like \`\`\`json.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Safety: AI often puts \`\`\`JSON ... \`\`\` wrappers. We strip them.
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate roadmap from AI");
  }
};

module.exports = { generateRoadmapJSON };
