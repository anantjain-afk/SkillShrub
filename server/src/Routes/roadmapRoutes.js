const express = require('express');
const router = express.Router();
const { createRoadmap, getUserRoadmaps, getRoadmap } = require('../Controllers/roadmapController');

// POST /api/roadmaps/generate
router.post('/generate', createRoadmap);

// GET /api/roadmaps/user/:userId
router.get('/user/:userId', getUserRoadmaps);

// GET /api/roadmaps/:id
router.get('/:id', getRoadmap);

module.exports = router;