const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const anunturiRoutes = require('./routes/anunturi');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

app.use('/api', authRoutes);
app.use('/api/anunturi', anunturiRoutes);

app.get('/', (req, res) => {
  res.send('✅ Backend ebay-anunturi funcționează.');
});

mongoose
  .connect(process.env.MONGODB_URI, {
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
