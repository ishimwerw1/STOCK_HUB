const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ishimwerda@gmail.com',
    pass: 'yiuf vjbl wbbl ajxb',
  },
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(400).json({ message: 'Username or email already exists' });
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashed });
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account with that email' });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    user.resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
      from: '"StockHub Ltd" <ishimwerda@gmail.com>',
      to: email,
      subject: 'Password Reset Code - StockHub Ltd',
      html: `
        <div style="font-family:Arial;max-width:480px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:16px">
          <div style="text-align:center;margin-bottom:24px">
            <div style="font-size:40px;margin-bottom:8px">📦</div>
            <h1 style="color:#1e293b;margin:0;font-size:20px">StockHub Ltd</h1>
            <p style="color:#64748b;font-size:13px">Password Reset Request</p>
          </div>
          <div style="background:white;border-radius:12px;padding:24px;text-align:center">
            <p style="color:#475569;font-size:14px;margin:0 0 16px">Use the code below to reset your password. This code expires in 15 minutes.</p>
            <div style="background:#f1f5f9;border-radius:12px;padding:16px;letter-spacing:8px;font-size:32px;font-weight:bold;color:#3b82f6">${code}</div>
          </div>
          <p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:20px">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: 'Verification code sent to your email' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    const user = await User.findOne({ email, resetCode: code, resetCodeExpires: { $gt: new Date() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired code' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
