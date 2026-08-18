const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "No token, authorization denied" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret-key');
    
    // Fetch user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }
    
    req.userId = decoded.id;
    req.user = user;
    
    console.log('Auth successful - User ID:', req.userId);
    next();
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(401).json({ 
      success: false,
      message: "Token is not valid" 
    });
  }
};

module.exports = protect;           
module.exports.protect = protect;   