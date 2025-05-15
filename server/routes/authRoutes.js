const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup route with file upload middleware
router.post('/signup', authController.upload, authController.signup);

// Login route
router.post('/login', authController.login);

module.exports = router;
