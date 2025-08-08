const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const authRoutes = require('./routes/auth');
const anunturiRoutes = require('./routes/anunturi');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rute
app.use('/api', authRoutes);
app.use('/api/anunturi', anunturiRoutes);

// Conectare MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log('✅ Conectat la MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Serverul rulează pe portul ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Eroare conectare MongoDB:', err);
  });
