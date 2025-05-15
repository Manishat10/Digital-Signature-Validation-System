const express = require('express');
const router = express.Router();
const { verifyFace } = require('../controllers/certificateController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/verify', authMiddleware, verifyFace);

module.exports = router;