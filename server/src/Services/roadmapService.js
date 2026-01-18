const prisma = require("../../db/config");
const crypto = require("crypto");


const saveRoadmap = async (title, roadmapData, userId) => {
    // roadmapData is the JSON object that is received from the ai . 
    // It has the nodes and edges as arrays . 

  return await prisma.$transaction(async (tx) => {
    // 1. Create the Roadmap
    const roadmap = await tx.roadmap.create({
      data: { 
          title: title,
          userId: userId // Link to user
      }
    });

    // Map to store mapping from AI-provided ID ("1", "2") to actual Database UUID
    const idMapping = {};

    // 2. Create the Nodes (linked to the roadmap)
    // We map over the AI nodes to add the roadmapId AND generate a unique ID
    const nodesToCreate = roadmapData.nodes.map(node => {
      const dbId = crypto.randomUUID(); // Generate unique ID
      idMapping[node.id] = dbId; // Store mapping

      return {
        id: dbId,
        roadmapId: roadmap.id,
        title: node.title,
        description: node.description,
        xpReward: node.xpReward,
        positionX: node.positionX || 0,
        positionY: node.positionY || 0
      };
    });

    await tx.node.createMany({
      data: nodesToCreate
    });

    // 3. Create the Edges
    // We must use the mapped UUIDs for source and target
    const edgesToCreate = roadmapData.edges.map(edge => ({
      roadmapId: roadmap.id,
      sourceNodeId: idMapping[edge.source],
      targetNodeId: idMapping[edge.target]
    }));

    await tx.edge.createMany({
      data: edgesToCreate
    });

    // 4. Return the full roadmap with relations
    return await tx.roadmap.findUnique({
      where: { id: roadmap.id },
      include: {
        nodes: true,
        edges: true
      }
    });
  });
};

module.exports = { saveRoadmap };
