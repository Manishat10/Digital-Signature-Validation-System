const pool = require('../config/db');
const path = require('path');

// Get a specific certificate by certificate number
const getCertificateByNumber = async (req, res) => {
    const { certificatenumber } = req.params;
    try {
        const query = 'SELECT * FROM certificates WHERE certificatenumber = $1';
        const { rows } = await pool.query(query, [certificatenumber]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        let certificate = rows[0];
        // Transform file paths to public URLs
        const baseUrl = `http://localhost:5000/certificate_images/${certificatenumber}`;
        certificate = {
            ...certificate,
            documentphoto: certificate.documentphoto ? `${baseUrl}/${path.basename(certificate.documentphoto)}` : null,
            signaturephoto: certificate.signaturephoto ? `${baseUrl}/${path.basename(certificate.signaturephoto)}` : null,
            signatoryphoto: certificate.signatoryphoto ? `${baseUrl}/${path.basename(certificate.signatoryphoto)}` : null,
        };
        res.json(certificate);
    } catch (error) {
        console.error('Error fetching certificate:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get certificate by hash
const getCertificateByHash = async (req, res) => {
    const { certificatehash } = req.params;
    try {
        const result = await pool.query(
            'SELECT * FROM certificates WHERE hash = $1',
            [certificatehash]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        let certificate = result.rows[0];
        // Transform file paths to public URLs
        const baseUrl = `http://localhost:5000/certificate_images/${certificate.certificatenumber}`;
        certificate = {
            ...certificate,
            documentphoto: certificate.documentphoto ? `${baseUrl}/${path.basename(certificate.documentphoto)}` : null,
            signaturephoto: certificate.signaturephoto ? `${baseUrl}/${path.basename(certificate.signaturephoto)}` : null,
            signatoryphoto: certificate.signatoryphoto ? `${baseUrl}/${path.basename(certificate.signatoryphoto)}` : null,
        };
        res.json(certificate);
    } catch (error) {
        console.error('Error fetching certificate by hash:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getCertificateByNumber, getCertificateByHash };