const express = require('express');
const { getQRCode } = require('../controllers/qrController');
const router = express.Router();

// Get QR Code as Base64 (Public access, no authentication required)
router.get('/:certificatenumber', getQRCode);

module.exports = router;