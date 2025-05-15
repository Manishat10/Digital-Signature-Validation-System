const express = require('express');
const { getUserCertificates, getCertificateByNumber, createCertificate, deleteCertificate,verifyFace,verifyCertificateOnChain } = require('../controllers/certificateController');
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();
// Fetch all certificates for the logged-in user
router.get('/user-certificates', authMiddleware, getUserCertificates);

// Fetch a single certificate by certificate number (restricted to logged-in user)
router.get('/:certificatenumber', authMiddleware, getCertificateByNumber);

//handle creation of a new signature certificate
router.post('/makecertificate', authMiddleware, createCertificate);

router.delete('/:certificatenumber', authMiddleware, deleteCertificate);

// Face verification route
router.post('/verify-face', verifyFace);

// Verify certificate on blockchain (public)
router.get('/verify/:certificatenumber', verifyCertificateOnChain);

module.exports = router;


