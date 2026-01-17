const prisma = require("../../db/config");


const saveRoadmap = async (title, roadmapData) => {
    // roadmapData is the JSON object that is received from the ai . 
    // It has the nodes and edges as arrays . 

  return await prisma.$transaction(async (tx) => {
    // 1. Create the Roadmap
    const roadmap = await tx.roadmap.create({
      data: { title: title }
    });


    // 2. Create the Nodes (linked to the roadmap)
    // We map over the AI nodes to add the roadmapId
    await tx.node.createMany({
      data: roadmapData.nodes.map(node => ({
        id: node.id,
        roadmapId: roadmap.id,
        title: node.title,
        description: node.description,
        xpReward: node.xpReward
      }))
    });

    // 3. Create the Edges
    await tx.edge.createMany({
      data: roadmapData.edges.map(edge => ({
        roadmapId: roadmap.id,
        sourceNodeId: edge.source,
        targetNodeId: edge.target
      }))
    });

    return roadmap;
  });
};

module.exports = { saveRoadmap };
