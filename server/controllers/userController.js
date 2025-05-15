const pool = require('../config/db');

// Fetch user info
const getUser = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, photo FROM users WHERE id = $1', [req.user.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found!' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user info:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUser };
