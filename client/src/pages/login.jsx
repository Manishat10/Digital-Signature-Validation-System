import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Styles/login.css';
import Navbar from "../components/navbar";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and Password are required!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Parse the response

      if (response.ok) {
        console.log('Login successful:', data); // Debugging
        if (data.token) {
          localStorage.setItem('token', data.token); // Save the token
          alert('Login Successful! Redirecting to dashboard...');
          // setError('');
          navigate('/userdashboard'); // Redirect to dashboard
         } else {
          setError('Login failed: No token received');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Error during login:', err); // Debug server errors
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div>   
      <div className="login-page-bg"> 
      <Navbar />
    <div className="login-container">
      <div className="login-box">
        <h2>LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>

        <p className="home-link">
          <Link to="/">HOME</Link>
        </p>
      </div>
    </div>
    </div>
    </div>  
  );
};

export default Login;
