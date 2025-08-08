const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const anunturiRoutes = require('./routes/anunturi');
const path = require('path');

dotenv.config();

const app = express();

// ✅ CORS CORESPUNZĂTOR pentru frontend-ul tău live
app.use(cors({
  origin: 'https://ebay-anunturi.ro',
  credentials: true,
}));

app.use(express.json());

// 🔐 Rute autentificare
app.use('/api', authRoutes);

// 📢 Rute anunțuri
app.use('/api/anunturi', anunturiRoutes);

// 🧪 Rută de test
app.get('/api/test', (req, res) => {
  res.json({ mesaj: 'Backend funcționează corect!' });
});

// ✅ Server + MongoDB
const PORT = process.env.PORT || 10000;

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Conectat la MongoDB');
  app.listen(PORT, () => {
    console.log(`🚀 Serverul rulează pe portul ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ Eroare conectare MongoDB:', err);
});
