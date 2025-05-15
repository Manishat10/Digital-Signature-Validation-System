import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Styles/pdfstamping.css';

const PdfStamping = () => {
  const { state } = useLocation();
  const { certificateNumber, qrCode, creationDate, creationTime } = state || {};
  const [pdfFile, setPdfFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pdfFile) {
      alert('Please upload a PDF file.');
      return;
    }

    const formData = new FormData();
    formData.append('pdfFile', pdfFile);
    formData.append('qrCode', qrCode);
    formData.append('text', `Digitally Signed\nOn: ${new Date(creationDate).toLocaleDateString('en-GB')} ${creationTime}`);
    // formData.append('text', `By:${signatoryName}`);

    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/pdf/stamp', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = pdfFile.name; 
        link.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Error stamping PDF');
      }
    } catch (error) {
      console.error('Error submitting PDF:', error);
    }
  };

  return (
    <div className="pdf-stamping">
      <h2>Insert Digital Signature into Document</h2>
      <p><strong>Certificate Number:</strong> {certificateNumber}</p>
      {qrCode && (
        <p><strong>QR Code Preview:</strong><br />
          <img src={qrCode} alt="QR Code" width="100" />
        </p>
      )}
      <p><strong>Text:</strong> Digitally Signed On: {new Date(creationDate).toLocaleDateString('en-GB')} {creationTime}
      </p>

      <form onSubmit={handleSubmit}>
        <label>
          Upload PDF to Stamp:
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
        </label>
        <button type="submit">Stamp on PDF</button>
        <button type="button" onClick={() => navigate(-1)} style={{ marginLeft: '10px' }}>Cancel/Go Back</button>
      </form>
    </div>
  );
};

export default PdfStamping;