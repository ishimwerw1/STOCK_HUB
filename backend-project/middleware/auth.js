const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  if (req.method === 'OPTIONS') return next();

  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  console.log(`[AUTH] ${req.method} ${req.path} - auth:`, authHeader ? 'present' : 'missing');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(`[AUTH] Token verification failed: ${err.message}`);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
