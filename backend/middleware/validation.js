const validator = require('validator');

// Sanitize and validate input
const validateRegistration = (req, res, next) => {
  const { email, password, role } = req.body;

  // Validate email
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Valid email is required' });
  }

  // Validate password
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // Validate role
  if (!role || !['entrepreneur', 'investor'].includes(role)) {
    return res.status(400).json({ message: 'Valid role is required (entrepreneur or investor)' });
  }

  // Sanitize email
  req.body.email = validator.normalizeEmail(email);
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  // Validate email
  if (!email || !validator.isEmail(email)) {
    return res.status(400).json({ message: 'Valid email is required' });
  }

  // Validate password
  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  // Sanitize email
  req.body.email = validator.normalizeEmail(email);
  
  next();
};

const sanitizeInput = (req, res, next) => {
  // Prevent XSS by escaping HTML in string fields
  for (let key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = validator.escape(req.body[key]);
    }
  }
  next();
};

module.exports = {
  validateRegistration,
  validateLogin,
  sanitizeInput
};