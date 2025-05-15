import React, { useEffect, useState } from "react";
import "./Styles/signverification.css";
import Navbar from "../components/navbar";
import fileImage from "../resources/file.png";
import hashImage from "../resources/hash.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import QrScanner from "qr-scanner";

const SignatureVerification = () => {
  const [scanResult, setScanResult] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [file, setFile] = useState(null);
  const [generatedUrl, setGeneratedUrl] = useState(null);
  const [certificateNumber, setCertificateNumber] = useState("");
  const [certificateHash, setCertificateHash] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  // Base URL for the frontend (configurable for deployment)
const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_URL || "http://localhost:5173";


  useEffect(() => {
    let qrScanner;
    const video = document.getElementById("qr-video");

    if (showCamera && video) {
      qrScanner = new QrScanner(
        video,
        (result) => {
          console.log("Live scan result:", result.data);
          setScanResult(result.data);
          handleQrScan(result.data); 
          setShowCamera(false);
          qrScanner.stop();
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      qrScanner.start().catch((err) => {
        console.error("Error starting scanner:", err);
        setShowCamera(false);
      });
    }

    return () => {
      if (qrScanner) {
        qrScanner.stop();
        qrScanner.destroy();
      }
    };
  }, [showCamera]);


  const handleQrScan = async (hash) => {
    try {
      setError(null);
      const response = await axios.get(`http://localhost:5000/api/publiccertificate/hash/${hash}`);
      const { certificatenumber } = response.data;
      const url = `${FRONTEND_BASE_URL}/publiccertificate/${certificatenumber}`;
      setGeneratedUrl(url); 
    } catch (err) {
      console.error("Error verifying QR code hash:", err);
      setError(err.response?.data?.message || "Error verifying QR code");
      setGeneratedUrl(null); 
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      try {
        const result = await QrScanner.scanImage(file, {
          returnDetailedScanResult: true,
        });
        console.log("Extracted QR Code Text:", result.data);
        setScanResult(result.data);
        handleQrScan(result.data); 
      } catch (error) {
        console.error("QR Code scanning failed:", error);
        setScanResult("Error: Unable to scan QR code");
        setError("Error scanning QR code image");
        setGeneratedUrl(null);
      }
    }
  };

  const handleCertificateVerify = async () => {
    try {
      setError(null);
      await axios.get(`http://localhost:5000/api/publiccertificate/${certificateNumber}`);
      navigate(`/publiccertificate/${certificateNumber}`);
    } catch (err) {
      setError(err.response?.data?.message || "Error verifying certificate");
    }
  };

  const handleCertificateVerify2 = async () => {
    try {
      setError(null);
      const response = await axios.get(`http://localhost:5000/api/publiccertificate/hash/${certificateHash}`);
      const { certificatenumber } = response.data;
      navigate(`/publiccertificate/${certificatenumber}`);
    } catch (err) {
      setError(err.response?.data?.message || "Error verifying certificate");
    }
  };

  
  const handleLinkClick = (e, url) => {
    e.preventDefault(); 
    const path = url.replace(FRONTEND_BASE_URL, ""); // Extract the path (e.g., /publiccertificate/123)
    navigate(path); // Navigate in the same tab
  };

  return (
    <div>
      <div style={{ backgroundColor: '#f2f2f2', minHeight: '100vh' }}>
      <Navbar />
      <h1 className="verification-title">Digital Signature Verification</h1>
      
      <div className="verification-container">
        {/* Hash Verification */}
        <div className="verification-box left-container">
          <h2>Enter Hash Code</h2>
          <div className="input-section">
            <img src={hashImage} alt="File preview" className="hash-image" />
            <input
              type="text"
              className="input-field"
              placeholder="Enter hash code"
              value={certificateHash}
              onChange={(e) => setCertificateHash(e.target.value)}
            />
            <button type="button" className="verify-button" onClick={handleCertificateVerify2}>
              Verify
            </button>
          </div>
        </div>

        {/* Certificate Number Verification */}
        <div className="verification-box center-container">
          <h2>Enter Certificate Number</h2>
          <div className="input-section">
            <img src={fileImage} alt="File preview" className="file-image" />
            <input
              type="text"
              className="input-field"
              placeholder="Enter certificate number"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
            />
            <button type="button" className="verify-button" onClick={handleCertificateVerify}>
              Verify
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}
        </div>

        {/* QR Scan Section */}
        <div className="verification-box right-container">
          <h2>Scan QR Code</h2>
          <div>
            <div>
              {!showCamera ? (
                <button className="verify-button" onClick={() => setShowCamera(true)}>Use Camera</button>
              ) : (
                <button className="verify-button" onClick={() => setShowCamera(false)}>Close Camera</button>
              )}
              <button className="verify-button" onClick={() => document.getElementById("fileInput").click()}>
                Upload Image
              </button>
            </div>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </div>

          {/* Camera Scanner */}
          {showCamera && (
            <div className="qr-reader-box">
              <video id="qr-video" />
            </div>
          )}

          {/* Scanned Results */}
          {scanResult && (
            <div className="qr-result-container">
              <p className="qr-scan-text">
                <strong>Scanned Hash:</strong>
                <br />
                <span>{scanResult}</span>
              </p>
              {generatedUrl && (
                <div className="qr-url-box">
                  <p>
                    <strong>Certificate URL:</strong>
                    <br />
                    <a
                      href={generatedUrl}
                      onClick={(e) => handleLinkClick(e, generatedUrl)}
                      rel="noopener noreferrer"
                    >
                      {generatedUrl}
                    </a>
                  </p>
                </div>
              )}
              <button
                className="clear-button"
                onClick={() => {
                  setScanResult(null);
                  setGeneratedUrl(null);
                  setFile(null);
                  setError(null);
                }}
              >
                Clear Result
              </button>
            </div>
          )}

          {file && <p>Uploaded File: {file.name}</p>}
          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignatureVerification;