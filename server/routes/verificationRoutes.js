const express = require('express');
const { getCertificateByNumber, getCertificateByHash } = require('../controllers/verificationController');
const router = express.Router();

router.get('/:certificatenumber', getCertificateByNumber); 
router.get('/hash/:certificatehash', getCertificateByHash); 

module.exports = router;