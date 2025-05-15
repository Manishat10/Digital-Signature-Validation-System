import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Webcam from 'react-webcam';
import './Styles/signup.css';
import Navbar from "../components/navbar";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const webcamRef = useRef(null);

  // Lock scrolling when the camera modal is open
  useEffect(() => {
    if (isCameraOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isCameraOpen]);

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setPhoto(imageSrc);
    setIsCameraOpen(false);
  };

  const handleRetake = () => {
    setPhoto(null);
    setIsCameraOpen(true);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !name || !password || !dob || !photo) {
      setError('All fields, including a live photo, are required!');
      return;
    }
  
    try {
      // Convert the base64 image to a Blob
      const byteCharacters = atob(photo.split(',')[1]);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        byteArrays.push(new Uint8Array(byteNumbers));
      }
      const blob = new Blob(byteArrays, { type: 'image/jpeg' });
  
      // Create FormData to send to the backend
      const formData = new FormData();
      formData.append('email', email);
      formData.append('name', name);
      formData.append('password', password);
      formData.append('dob', dob);
      formData.append('photo', blob, 'photo.jpg'); // The second argument is the file name
  
      // Send data to backend
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        alert('Signup Successful! Redirecting to login...');
        setError('');
        window.location.href = '/login'; // Redirect to login
      } else {
        const data = await response.json();
        setError(data.message || 'Signup failed');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };
      

  return (
    <div className="signup-page-bg">      
      <Navbar />
    <div className="signup-container">
      <div className="signup-box">
        <h2>SIGN UP</h2>
        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {/* Name input */}
          <div className="input-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          {/* Date of Birth input */}
          <div className="input-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
            />
          </div>

          {/* Password input */}
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {/* Camera Capture */}
          <div className="input-group">
            <label>User Photograph</label>
            {!photo ? (
              <button
                type="button"
                className="camera-btn"
                onClick={() => setIsCameraOpen(true)}
              >
                Open Camera
              </button>
            ) : (
              <div className="photo-preview">
                <img src={photo} alt="Captured" />
                <button
                  type="button"
                  className="retake-btn"
                  onClick={handleRetake}
                >
                  Retake
                </button>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && <p className="error">{error}</p>}
          
          {/* Submit button */}
          <button type="submit" className="login-btn">Sign Up</button>
        </form>
       
        {/* Links to Login and Home */}
        <p className="login-link">
          Back to <Link to="/login">Login</Link>
        </p>
        <p className="home-link">
          <Link to="/">HOME</Link>
        </p>
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="camera-modal">
          <div className="camera-container">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="webcam"
              width={300}
              height={300}
            />
            <div className="camera-controls">
              <button
                type="button"
                className="capture-btn"
                onClick={handleCapture}
              >
                Capture
              </button>
              <button
                type="button"
                className="close-btn"
                onClick={() => setIsCameraOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default Signup;
