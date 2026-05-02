const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');

exports.protect = async (req, res, next) => {
  try {
    // 1. Get token from HTTP-only cookie
    const token = req.cookies.jwt;
    
    if (!token) {
      return next(new ApiError(401, 'Please log in to access this resource'));
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Check if user still exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
      return next(new ApiError(401, 'User no longer exists'));
    }

    // 4. Grant access
    req.user = currentUser;
    next();
    
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};