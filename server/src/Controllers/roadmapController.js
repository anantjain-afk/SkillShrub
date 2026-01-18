const { saveRoadmap } = require("../Services/roadmapService");
const { generateRoadmapJSON } = require("../Services/aiService");
const prisma = require("../../db/config");

const createRoadmap = async (req, res) => {
    try {
        const { topic, userId } = req.body; // Expect userId from frontend
        if (!topic) {
            return res.status(400).json({ error: "Topic is required" });
        }

        const roadmapData = await generateRoadmapJSON(topic);
        
        // Pass userId (can be null for anonymous, but we want logged in)
        const road = await saveRoadmap(topic, roadmapData, userId ? parseInt(userId) : null);
        
        res.status(200).json({ roadmap: road });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create roadmap" });
    }
};

const getUserRoadmaps = async (req, res) => {
    try {
        const { userId } = req.params;
        const roadmaps = await prisma.roadmap.findMany({
            where: { userId: parseInt(userId) },
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({ roadmaps });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch roadmaps" });
    }
};

const getRoadmap = async (req, res) => {
    try {
        const { id } = req.params;
        const roadmap = await prisma.roadmap.findUnique({
            where: { id: parseInt(id) },
            include: { nodes: true, edges: true }
        });
        if (!roadmap) return res.status(404).json({ error: "Roadmap not found" });
        res.status(200).json({ roadmap });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch roadmap" });
    }
};

module.exports = { createRoadmap, getUserRoadmaps, getRoadmap };