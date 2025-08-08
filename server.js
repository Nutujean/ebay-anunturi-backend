import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import anunturiRoutes from './routes/anunturi.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Rute
app.use('/api/login', authRoutes);
app.use('/api/anunturi', anunturiRoutes);

// Pornire server și conectare la MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Conectat la MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Serverul rulează pe portul ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Eroare conectare MongoDB:', err);
  });
