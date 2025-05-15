const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Auth Header:", authHeader); 
  
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized: No token provided' });

  const token = authHeader.split(' ')[1];
  console.log("Extracted Token:", token); 

  if (!token) return res.status(401).json({ message: 'Unauthorized: Token is missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); 
    
    req.user = decoded;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(403).json({ message: 'Invalid token', error: error.message });
  }
};

module.exports = authMiddleware;
