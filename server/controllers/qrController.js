const pool = require('../config/db');
const QRCode = require('qrcode');
require('dotenv').config();

const getQRCode = async (req, res) => {
  const { certificatenumber } = req.params;

  try {
    // Fetch the hash from DB using certificatenumber
    const result = await pool.query(
      'SELECT hash FROM certificates WHERE certificatenumber = $1',
      [certificatenumber]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    const hash = result.rows[0].hash;

    // Embed only the hash in the QR code
    const qrData = hash;

    // Generate QR Code as a data URL
    const qrCodeBase64 = await QRCode.toDataURL(qrData);

    res.json({ qr_code: qrCodeBase64 });
  } catch (error) {
    console.error('Error generating QR Code:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getQRCode };