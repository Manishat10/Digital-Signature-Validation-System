import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Styles/dashboard.css";
import { motion } from "framer-motion";
import facerecogImg from '../resources/facerecog.jpg';
import hashingImg from '../resources/hashing.jpg';
import qrImg from '../resources/qrverification.jpg';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleButton1Click = () => {
    navigate("/login");
  };
  const handleButton2Click = () => {
    navigate("/verification");
  };

  const features = [
    { title: "Facial Verification", description: "Ensures Signatory identity with Face Recognition", img: facerecogImg },
    { title: "Secure Hashing And Blockchain", description: "SHA-256 for Signatures each reinforced with Blockchain", img: hashingImg },
    { title: "QR Verification", description: "Scan to instantly verify Signatures", img: qrImg },
  ];

  return (
    <div className="custom-page-bg">
      <div className="container">
        <div className="text-container">
          <h1>SigVault</h1>
          <p>
            A secure, modern digital signature system featuring face recognition and QR verification.
          </p>
        </div>
        <div className="button-container">
          <button className="big-button" onClick={handleButton1Click}>Create Sign Certificate</button>
          <button className="big-button" onClick={handleButton2Click}>Verify</button>
        </div>
      </div>

      {/* Specialities Section */}
      <div className="features-section">
        <h2>Features</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <motion.div
              className="feature-card"
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <img src={feature.img} alt={feature.title} className="feature-image" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="info-section">
        <h2>Why SigVault?</h2>
        <ul>
          <li>Independent and supports Cross Platform Usage</li>
          <li>JWT based Login for Users for enhanced security</li>
          <li>Face Verification of Signatory while Creation</li>
          <li>Embeds Signature Data into SHA256 hash</li>
          <li>Signature Creation transactions recorded on Blockchain, making it tamper-proof.</li>
          <li>Qr Code based Signature verification</li>
          <li>Ability to add signature stamp onto Documents(PDF)</li>

        </ul>
      </div>
    </div>
  );
};

export default Dashboard;