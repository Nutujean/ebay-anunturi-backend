const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIN
router.post('/login', async (req, res) => {
  const { email, parola } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Email inexistent' });

    const passwordMatch = await bcrypt.compare(parola, user.parola);
    if (!passwordMatch) return res.status(401).json({ message: 'Parolă greșită' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Eroare la autentificare' });
  }
});

module.exports = router;
