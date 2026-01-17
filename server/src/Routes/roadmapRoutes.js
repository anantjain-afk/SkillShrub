const express = require('express');
const router = express.Router();
const { createRoadmap } = require('../Controllers/roadmapController');

// POST /api/roadmaps/generate
router.post('/generate', createRoadmap);

module.exports = router;