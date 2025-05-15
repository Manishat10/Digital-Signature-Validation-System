const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes');
const pool = require('./config/db');
const path = require('path');

const certificateRoutes = require('./routes/certificateRoutes');
const faceVerificationRoutes = require('./routes/faceverificationRoutes');
const qrRoutes = require('./routes/qrRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const pdfRoutes = require('./routes/pdfRoutes');

dotenv.config();


const app = express(); // Initialize Express app

app.use('/certificate_images', express.static(path.join(__dirname, 'certificate_images')));

// Middleware

app.use(cors({ origin: 'http://localhost:5173' })); // Adjust origin if needed
app.use(express.json()); // Parse incoming JSON requests

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api', authRoutes); 
app.use('/api', userRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/face', faceVerificationRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/publiccertificate', verificationRoutes);
app.use('/api/pdf', pdfRoutes);

// Root route (for testing)
app.get('/', (req, res) => {
  res.send('Welcome to the backend server');
});

// Handle undefined routes
app.use((req, res) => res.status(404).json({ message: 'Route not found!' }));

// Check database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Database connection successful:', res.rows[0]);
  }
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found!' });
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


