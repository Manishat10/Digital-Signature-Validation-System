import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Styles/viewcertificate.css';

const ViewCertificate = () => {
  const { certificateNumber } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [qrCode, setQrCode] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const fetchCertificate = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/certificates/${certificateNumber}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setCertificate(data);
        } else {
          console.error('Certificate not found');
        }
      } catch (error) {
        console.error('Error fetching certificate:', error);
      }
    };

    const fetchQRCode = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/qr/${certificateNumber}`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok && data.qr_code) {
          setQrCode(data.qr_code); // Store the QR code Base64
        } else {
          console.error('QR Code not found');
        }
      } catch (error) {
        console.error('Error fetching QR Code:', error);
      }
    };

    fetchCertificate();
    fetchQRCode();
  }, [certificateNumber, navigate]);

  if (!certificate) return <p>Loading certificate...</p>;

  const handleStampToPDF = () => {

    navigate('/pdfstamping', { 

      state: { 

        certificateNumber, 

        qrCode, 

        creationDate: certificate.creationdate, 

        creationTime: certificate.creationtime,
        
        signatoryName: certificate.signatoryname

      } 

    });

  };

  return (
    <div className="certificate-view">
      <h2>Certificate Details</h2>
      <p><strong>Certificate Number:</strong> {certificate.certificatenumber}</p>
      <p><strong>Particulars:</strong> {certificate.particulars}</p>
      <p><strong>Description:</strong> {certificate.description}</p>
      <p><strong>Signatory:</strong> {certificate.signatoryname}</p>
      <p><strong>Creation Date:</strong> {new Date(certificate.creationdate).toLocaleDateString('en-GB')}</p>

      <p><strong>Creation Time:</strong> {certificate.creationtime}</p>
      <p><strong>IP Address:</strong> {certificate.deviceip}</p>
      <p><strong>Location:</strong> {certificate.location}</p>
      <p><strong>Expiry Date: </strong>{new Date(certificate.expirydate).toLocaleDateString('en-GB')}</p>
      <p><strong>Certificate Hash:</strong> {certificate.hash}</p>

      {/* Display images */}
      {certificate.documentphoto && (
        <p><strong>Document Photo:</strong><br />
          <img src={certificate.documentphoto} alt="Document" width="300" />
        </p>
      )}
      {certificate.signaturephoto && (
        <p><strong>Signature:</strong><br />
          <img src={certificate.signaturephoto} alt="Signature" width="300" />
        </p>
      )}
      {certificate.signatoryphoto && (
        <p><strong>Signatory Photo:</strong><br />
          <img src={certificate.signatoryphoto} alt="Signatory" width="300" />
          <h3>✅ Face Verified with the Owner</h3>
        </p>
      )}

      {/* Display QR Code */}
      {qrCode && (
        <p><strong>Verification QR Code:</strong><br />
          <img src={qrCode} alt="QR Code" width="200" />
        </p>
      )}

      <button onClick={() => navigate('/userdashboard')}>Back to Dashboard</button>
      <button onClick={handleStampToPDF} style={{ marginLeft: '10px' }}>Stamp To PDF</button>
    </div>
    
  );
};

export default ViewCertificate;
