const express = require('express');
const cors = require('cors');
const roadmapRoutes = require('./src/Routes/roadmapRoutes');

require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/users', require('./src/Routes/userRoutes'));
app.use('/api/progress', require('./src/Routes/progressRoutes'));

app.get('/', (req, res) => {
  res.send('SkillShrub Backend is Running with Prisma!');
});

app.listen(PORT, async () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
