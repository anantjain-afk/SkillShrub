const { PrismaClient } = require('@prisma/client');
require('dotenv').config(); 

console.log("DEBUG: Initializing Prisma.");
console.log("DEBUG: DATABASE_URL is:", process.env.DATABASE_URL);

const prisma = new PrismaClient();
module.exports = prisma;