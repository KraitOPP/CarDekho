const jwt = require('jsonwebtoken');
const { executeQuery } = require('../db/db.js');

const verifyJWT = async (req, res, next) => {
  try {
    let token = req.body.token || req.headers.authorization;
    if (!token){
      return res.status(401).json({
        success: false,
        message: "UnAuthenticated",
      });
    }

    if (token.startsWith("Bearer ")){
      token = token.slice(7, token.length).trim();
    }
    
    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const users = await executeQuery('SELECT id, role FROM users WHERE id = ?', [decodedToken.id]);
    
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid user' });
    }
    
    req.user = users[0];
    next();
  } catch (error){
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { verifyJWT };
