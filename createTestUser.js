require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log('✅ Conectat la MongoDB');

    const email = 'test@gmail.com';
    const parola = '123456';

    // Șterge utilizator existent dacă există deja
    await User.deleteOne({ email });

    const hashedPassword = await bcrypt.hash(parola, 10);

    const newUser = new User({
      email,
      parola: hashedPassword
    });

    await newUser.save();
    console.log('✅ Cont test creat cu succes!');
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error('❌ Eroare conectare MongoDB:', err);
  });
