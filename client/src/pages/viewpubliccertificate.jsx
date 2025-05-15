import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Styles/viewcertificate.css'; 

const ViewPublicCertificate = () => {
  const { certificateNumber } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [error, setError] = useState(null);
  
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/publiccertificate/${certificateNumber}`);
        setCertificate(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching certificate');
      }
    };

    const fetchQRCode = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/qr/${certificateNumber}`);
        if (response.data.qr_code) {
          setQrCode(response.data.qr_code);
        }
      } catch (err) {
        console.error('Error fetching QR Code:', err);
      }
    };

    fetchCertificate();
    fetchQRCode();
  }, [certificateNumber]);

  const handleVerifyOnChain = async () => {
    setVerifying(true);
    setVerifyResult(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/certificates/verify/${certificateNumber}`
      );
      setVerifyResult(response.data);
    } catch (err) {
      console.error("Verification error:", err.response?.data || err.message);
      setVerifyResult({
        message: err.response?.data?.message || err.message || 'Error verifying certificate on blockchain'
      });
    } finally {
      setVerifying(false);
    }
  };

  if (error) return <p className="error-message">{error}</p>;
  if (!certificate) return <p>Loading certificate...</p>;

  return (
    <div className="certificate-view">
      <h2>Digital Signature Certificate</h2>
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
      {certificate.transaction_hash && (
        <p>
        <strong>Blockchain Transaction:</strong>{' '}
        {certificate.transaction_hash}{' '}
       
      </p>
      )}
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
      {qrCode && (
        <p><strong>Verification QR Code:</strong><br />
          <img src={qrCode} alt="QR Code" width="200" />
        </p>
      )}
      <button 
        onClick={handleVerifyOnChain} 
        disabled={verifying || !certificate.transaction_hash}
        className="verify-blockchain-btn"
      >
        {verifying ? 'Verifying...' : 'Verify on Blockchain'}
      </button>
      {verifyResult && (
        <div className="verify-result">
          <h3>Blockchain Verification Result</h3>
          <p><strong>Status:</strong> {verifyResult.message}</p>
          {verifyResult.certificateNumber && (
            <>
              <p><strong>Certificate Number:</strong> {verifyResult.certificateNumber}</p>
              <p><strong>Hash:</strong> {verifyResult.hash}</p>
              <p><strong>Stored On:</strong> {new Date(verifyResult.timestamp).toLocaleString('en-GB')}</p>
              <p><strong>Transaction:</strong>{' '}
                <a 
                  href={`#${verifyResult.transactionHash}`} 
                  onClick={() => navigator.clipboard.write(verifyResult.transactionHash)}
                  title="Click to copy"
                >
                  {verifyResult.transactionHash}
                </a>
              </p>
            </>
          )}
          <button onClick={() => setVerifyResult(null)}>Close</button>
        </div>
      )}
      <button onClick={() => navigate('/verification')}>Back to Verification</button>
    </div>
  );
};

export default ViewPublicCertificate;