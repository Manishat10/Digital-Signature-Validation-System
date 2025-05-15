const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get the file extension (e.g., .jpg)
    const filename = `${uuidv4()}${ext}`; // Generate a unique filename using UUID
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Signup handler
const signup = async (req, res) => {
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  // Extract data from the request body
  const { name, email, password, dob } = req.body;

  // Ensure the photo file is uploaded
  const photo = req.file ? req.file.path : null;

  // Check if all fields are provided
  if (!name || !email || !password || !dob || !photo) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    // Hash the password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into the database
    const result = await pool.query(
      'INSERT INTO users (name, email, password, dob, photo) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email',
      [name, email, hashedPassword, dob, photo]
    );

    // Respond with success
    res.status(201).json({
      message: 'User registered successfully!',
      user: result.rows[0], // Return the newly created user (excluding password for security)
    });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// Login handler
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required!' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ message: 'User not found!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials!' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful!', token });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

// Fetch User Info
const getUser = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user details from the database
    const result = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [decoded.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user details back to the frontend
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error verifying token:', err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};


module.exports = { signup, login, getUser, upload: upload.single('photo') };
