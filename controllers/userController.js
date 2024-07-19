const { UserProfile } = require('../models');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await UserProfile.findByPk(req.user.user_id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};