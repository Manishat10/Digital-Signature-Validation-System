import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Webcam from 'react-webcam';
import axios from 'axios'; 
import "./Styles/certform.css";

const CertificateForm = () => {
  const navigate = useNavigate();
  const [documentphoto, setDocPhoto] = useState(null);
  const [signaturephoto, setSignPhoto] = useState(null);
  const [signatoryphoto, setSignatoryPhoto] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [storedImage, setStoredImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  
  const [loadingBlockchain, setLoadingBlockchain] = useState(false); 
  const [transactionHash, setTransactionHash] = useState(null); 
  
  const webcamRef = useRef(null);

  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [useDrawnSignature, setUseDrawnSignature] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isCameraOpen ? 'hidden' : 'auto';
  }, [isCameraOpen]);

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSignatoryPhoto(imageSrc);
    setIsCameraOpen(false);
  };

  const handleRetake = () => {
    setSignatoryPhoto(null);
    setIsVerified(false);
    setVerificationStatus(null);
    setIsCameraOpen(true);
  };

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setDrawing(true);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const handleVerifyIdentity = async () => {
    if (!signatoryphoto) {
      alert("Please capture a photo first!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      const blob = await fetch(signatoryphoto).then(res => res.blob());
      formData.append("signatoryphoto", blob, "captured_photo.jpg");

      const response = await axios.post("http://localhost:5000/api/face/verify", formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });

      const storedImageUrl = response.data.storedImage;

      if (response.data.success) {
        setVerificationStatus("✅ Identity Verified!");
        setIsVerified(true);
        setStoredImage(storedImageUrl);
      } else {
        setVerificationStatus(`❌ ${response.data.message}`);
        setIsVerified(false);
        setStoredImage(storedImageUrl);
      }

      if (response.data.similarity) {
        setVerificationStatus(prev => `${prev} (Similarity: ${response.data.similarity.toFixed(2)})`);
      }

      setShowPopup(true);
    } catch (error) {
      console.error("Face verification error:", error);
      setVerificationStatus("❌ Verification Error. Try Again.");
      setIsVerified(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isVerified) {
      alert("Identity not verified! Please verify before submitting.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: No token found. Please log in again.");
      navigate("/login");
      return;
    }

    setLoadingBlockchain(true); // Start blockchain loading

    setTransactionHash(null); // Reset transaction hash

    const formData = new FormData();
    formData.append("particulars", event.target.particulars.value);
    formData.append("description", event.target.description.value);
    formData.append("signatoryname", event.target.signatoryname.value);
    formData.append("expirydate", event.target.expirydate.value);
    formData.append("location", event.target.location.value);

    if (documentphoto) formData.append("docphoto", documentphoto);

    if (signatoryphoto) {
      const blob = await fetch(signatoryphoto).then(res => res.blob());
      formData.append("signatoryphoto", blob, "captured_photo.jpg");
    }

    if (useDrawnSignature) {
      const canvas = canvasRef.current;
      canvas.toBlob((blob) => {
        if (blob) {
          formData.append("signphoto", blob, "drawn_signature.png");
        }
        submitFormData(formData, token);
      });
    } else {
      if (signaturephoto) formData.append("signphoto", signaturephoto);
      submitFormData(formData, token);
    }

    
  };
  

  const submitFormData = async (formData, token) => {
    try {
      const response = await axios.post("http://localhost:5000/api/certificates/makecertificate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });

      console.log("API Response:", response.data);
      //alert(response.data.message || "Certificate created successfully!");

      setLoadingBlockchain(false); // Stop blockchain loading    

      setTransactionHash(response.data.transactionHash); // Store transaction hash

      alert(`Certificate created successfully!${response.data.transactionHash ? `\nBlockchain Transaction: ${response.data.transactionHash.slice(0, 10)}...` : ''}`);
      
      
      const certificateNumber = response.data.certificateNumber;
      if (!certificateNumber) throw new Error("Certificate number not returned from the server");
      navigate(`/certificate/${certificateNumber}`);
    } catch (error) {
      console.error("Error submitting certificate:", error);
      setLoadingBlockchain(false); // Stop loading on error
      alert("Failed to create certificate. Please try again.");
    }
  };

  return (
    <div className="certform-page-bg">
    <div className="mysec">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-container">
          <h2 id="sub">Please Enter the below details:</h2>

          <label htmlFor="particulars">Particulars</label>
          <input type="text" id="particulars" name="particulars" placeholder="Enter the document Name" required />

          <label htmlFor="description">Document Description</label>
          <input type="text" id="description" name="description" placeholder="Enter a brief document description" required />

          <label htmlFor="signatoryname">Signatory Name</label>
          <input type="text" id="signatoryname" name="signatoryname" placeholder="Enter the Name" required />

          <label htmlFor="docphoto">Document Photos (Optional)</label>
          <input type="file" id="documentphoto" name="docphoto" accept="image/*" onChange={(e) => handleFileChange(e, setDocPhoto)} />

          <label htmlFor="signphoto">Signature</label>
          <div className="signature-options">
            <label>
              <input type="radio" name="sigmethod" checked={!useDrawnSignature} onChange={() => setUseDrawnSignature(false)} />
              Upload Signature
            </label>
            &nbsp;&nbsp;
            <label>
              <input type="radio" name="sigmethod" checked={useDrawnSignature} onChange={() => setUseDrawnSignature(true)} />
              Draw Signature
            </label>
          </div>

          {!useDrawnSignature ? (
            <input type="file" id="signaturephoto" name="signaturephoto" accept="image/*" onChange={(e) => handleFileChange(e, setSignPhoto)} />
          ) : (
            <div className="signature-pad">
              <canvas
                ref={canvasRef}
                width={350}
                height={150}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />
              <button type="button" className="clear-btn" onClick={clearCanvas}>Clear</button>
            </div>
          )}

          <label htmlFor="signatoryphoto">Signatory Photo</label>
          <div className="input-group">
            <label>User Photograph</label>
            {!signatoryphoto ? (
              <button type="button" className="camera-btn" onClick={() => setIsCameraOpen(true)}>Open Camera</button>
            ) : (
              <div className="photo-preview">
                <img src={signatoryphoto} alt="Captured" />
                <button type="button" className="retake-btn" onClick={handleRetake}>Retake</button>
                <button type="button" className="verify-btn" onClick={handleVerifyIdentity}>Verify Identity</button>
              </div>
            )}
          </div>

          {isCameraOpen && (
            <div className="camera-modal">
              <div className="camera-container">
                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className="webcam" width={300} height={300} />
                <div className="camera-controls">
                  <button type="button" className="capture-btn" onClick={handleCapture}>Capture</button>
                  <button type="button" className="close-btn" onClick={() => setIsCameraOpen(false)}>Close</button>
                </div>
              </div>
            </div>
          )}

        {verificationStatus && <p className="verification-status">{verificationStatus}</p>}

          <label htmlFor="expirydate">Expiry Date:</label>
          <input type="date" id="expirydate" name="expirydate" required />

          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" placeholder="Location" />


{loadingBlockchain && <p className="blockchain-loading">🔗 Writing to Blockchain...</p>} {/* Loading indicator */}
{transactionHash && (

  <p className="blockchain-success">

    <span role="img" aria-label="blockchain">✅</span> Blockchain Secured (Transaction: 

    <a 

      href={`#${transactionHash}`} 

      onClick={() => navigator.clipboard.write(transactionHash)}

      title="Click to copy"

    >

      {transactionHash.slice(0, 6)}...{transactionHash.slice(-4)}

    </a>)

  </p>

)}



          {showPopup && (
            <div className="popup">
              <h3>Face Comparison</h3>
              <div className="image-container">
                <div>
                  <p>Stored Image</p>
                  <img src={storedImage} alt="Stored Face" width="150" />
                </div>
                <div>
                  <p>Captured Image</p>
                  <img src={signatoryphoto} alt="Captured Face" width="150" />
                </div>
              </div>
              <p>{verificationStatus}</p>
              <button onClick={() => setShowPopup(false)}>Close & Proceed</button>
            </div>
          )}

          <div className="button-container">
          <input type="submit" value={loadingBlockchain ? "Submitting..." : "Submit"} disabled={!isVerified || loadingBlockchain} />
            <input type="reset" value="Reset" />
            <button type="button" className="homebutton" onClick={() => navigate("/userdashboard")}>Home</button>
          </div>
        </div>
      </form>
    </div>
    </div>
  );
};

export default CertificateForm;
