const { saveRoadmap } = require("../Services/roadmapService");
const { generateRoadmapJSON } = require("../Services/aiService");

const createRoadmap = async (req, res) => {
    try {
        const { topic } = req.body;
        if (!topic) {
            return res.status(400).json({ error: "Topic is required" });
        }

        const roadmapData = await generateRoadmapJSON(topic);
        // The AI output doesn't strictly return a title, so we use the user's topic.
        const roadmap = await saveRoadmap(topic, roadmapData);
        
        res.status(200).json({ roadmap });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create roadmap" });
    }
};

module.exports = { createRoadmap };