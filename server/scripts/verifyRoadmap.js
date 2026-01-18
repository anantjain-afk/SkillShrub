const { saveRoadmap } = require("../src/Services/roadmapService");
const prisma = require("../db/config");

const testRoadmapCreation = async () => {
    const mockData = {
        nodes: [
            { id: "1", title: "Node 1", description: "Desc 1", xpReward: 100 },
            { id: "2", title: "Node 2", description: "Desc 2", xpReward: 100 }
        ],
        edges: [
            { source: "1", target: "2" }
        ]
    };

    try {
        console.log("Creating Roadmap 1...");
        const r1 = await saveRoadmap("Test Roadmap 1", mockData, null);
        console.log("Roadmap 1 Created:", r1.id);
        if (r1.nodes && r1.nodes.length > 0) {
            console.log(`SUCCESS: Roadmap 1 returned with ${r1.nodes.length} nodes.`);
        } else {
            console.error("FAILURE: Roadmap 1 returned WITHOUT nodes!");
        }

        console.log("Creating Roadmap 2...");
        const r2 = await saveRoadmap("Test Roadmap 2", mockData, null);
        console.log("Roadmap 2 Created:", r2.id);

        console.log("SUCCESS: Both roadmaps created without ID collision!");
    } catch (error) {
        console.error("FAILURE: Error creating roadmaps:", error);
    } finally {
        await prisma.$disconnect();
    }
};

testRoadmapCreation();
