const express = require('express');
const router = express.Router();
const multer = require('multer');
const { stampPDF } = require('../controllers/pdfController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming you have auth middleware

const upload = multer({ dest: 'uploads/' });

router.post('/stamp', authMiddleware, upload.fields([{ name: 'pdfFile' }]), stampPDF);

module.exports = router;