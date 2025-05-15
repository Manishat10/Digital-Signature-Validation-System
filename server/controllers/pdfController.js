const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

const stampPDF = async (req, res) => {
  try {
    const pdfFile = req.files['pdfFile'][0];
    const qrCodeBase64 = req.body.qrCode; // Base64 QR code
    const textToAdd = req.body.text; // e.g., "Digitally Signed\nOn: DD/MM/YYYY HH:MM:SS"

    const pdfBytes = fs.readFileSync(pdfFile.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Extract QR code image from Base64
    const qrCodeImageBytes = Buffer.from(qrCodeBase64.split(',')[1], 'base64');
    const qrCodeImage = await pdfDoc.embedPng(qrCodeImageBytes);

    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
    const { width } = lastPage.getSize();

    // Positioning variables
    const qrWidth = 80;
    const qrHeight = 80;
    const textSize = 10;
    const padding = 5; 
    const x = width - 120; 
    const y = 50;

    // Add QR code
    lastPage.drawImage(qrCodeImage, {
      x,
      y: y + textSize * 2 + padding * 2, 
      width: qrWidth,
      height: qrHeight,
    });

    const textLines = textToAdd.split('\n');
    textLines.forEach((line, index) => {
      lastPage.drawText(line, {
        x,
        y: y + textSize * (textLines.length - 1 - index) + padding, 
        size: textSize,
        color: rgb(0, 0, 0),
      });
    });


    const pdfBytesModified = await pdfDoc.save();
    res.setHeader('Content-Disposition', `attachment; filename="${pdfFile.originalname}"`); 
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdfBytesModified));

    // Cleanup
    fs.unlinkSync(pdfFile.path);
  } catch (error) {
    console.error('Error stamping PDF:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { stampPDF };