const prisma = require("../../db/config");

// POST /api/progress/update
const updateProgress = async (req, res) => {
    try {
        const { userId, nodeId, status } = req.body;

        if (!userId || !nodeId || !status) {
            return res.status(400).json({ error: "Missing fields" });
        }

        // Upsert progress
        const progress = await prisma.userProgress.upsert({
            where: {
                userId_nodeId: { userId, nodeId }
            },
            update: {
                status,
                completedAt: status === 'COMPLETED' ? new Date() : null
            },
            create: {
                userId,
                nodeId,
                status,
                completedAt: status === 'COMPLETED' ? new Date() : null
            }
        });

        // If completed, add XP to user
        if (status === 'COMPLETED') {
            const node = await prisma.node.findUnique({ where: { id: nodeId } });
            if (node) {
                await prisma.user.update({
                    where: { id: userId },
                    data: { xpTotal: { increment: node.xpReward } }
                });
            }
        }

        res.status(200).json({ progress });

    } catch (error) {
        console.error("Update Progress Error:", error);
        res.status(500).json({ error: "Failed to update progress" });
    }
};

// GET /api/progress/:userId
const getUserProgress = async (req, res) => {
    try {
        const { userId } = req.params;
        const progress = await prisma.userProgress.findMany({
            where: { userId: parseInt(userId) }
        });
        res.status(200).json({ progress });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch progress" });
    }
};

module.exports = { updateProgress, getUserProgress };
