const express = require('express');
const app = express();

// Middleware (dacă ai nevoie)
// app.use(express.json());

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Serverul rulează cu succes!');
});

app.listen(port, () => {
  console.log(`Serverul rulează pe portul ${port}`);
});



