const jwt = require('jsonwebtoken');
const { executeQuery } = require('../db/db.js');

const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized request' });
    }
    
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const users = await executeQuery('SELECT id,role from users WHERE id = ?', [decodedToken.id]);
    
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid user' });
    }
    
    req.user = users[0];
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { verifyJWT };
