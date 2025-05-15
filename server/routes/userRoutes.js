const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Fetch user info (protected route)
router.get('/user', authMiddleware, userController.getUser);

module.exports = router;
