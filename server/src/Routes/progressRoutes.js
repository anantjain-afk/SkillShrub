const express = require('express');
const router = express.Router();
const { updateProgress, getUserProgress } = require('../Controllers/progressController');

router.post('/update', updateProgress);
router.get('/:userId', getUserProgress);

module.exports = router;
