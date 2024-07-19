const { UserProfile, Token } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = (user) => {
  return jwt.sign({ user_id: user.user_id }, crypto.randomBytes(64).toString('hex'), { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ user_id: user.user_id }, crypto.randomBytes(64).toString('hex'), { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    const { user_name, name, gender, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserProfile.create({ user_name, name, gender, email, password: hashedPassword });
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await Token.create({ user_id: user.user_id, access_token: accessToken, refresh_token: refreshToken });
    res.status(201).json({ user, accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { user_name, password } = req.body;
    const user = await UserProfile.findOne({ where: { user_name } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await Token.update({ access_token: accessToken, refresh_token: refreshToken, updated_at: new Date() }, { where: { user_id: user.user_id } });
    res.json({ accessToken, refreshToken, user_id: user.user_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  const { token, user_id } = req.body;
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  try {
    const user = await UserProfile.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    const tokenRecord = await Token.findOne({ where: { user_id: user_id } });
    if (!tokenRecord) {
      return res.status(404).json({ error: 'Token not found.' });
    }
    const decoded = jwt.verify(token, tokenRecord.refresh_token);
    const newAccessToken = generateAccessToken(user);
    await Token.update({ access_token: newAccessToken, updated_at: new Date() }, { where: { user_id: user.user_id } });
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token.' });
  }
};