const { UserProfile, Token } = require('../models');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    // Find the token record in the database
    const tokenRecord = await Token.findOne({ where: { access_token: token } });
    if (!tokenRecord) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    // Find the associated user
    const user = await UserProfile.findByPk(tokenRecord.user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Attach the user object to the request
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).json({ error: 'Invalid token.' });
  }
};