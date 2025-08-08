const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Middleware pentru verificarea tokenului JWT
const verificaToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ mesaj: 'Token lipsă' });

  try {
    const decoded = jwt.verify(token, 'cheie_secreta');
    req.utilizator = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ mesaj: 'Token invalid' });
  }
};

// Bază de date temporară (în memorie)
let anunturi = [];
let idCounter = 1;

// ✅ GET /api/anunturi - toate anunțurile
router.get('/', (req, res) => {
  res.json(anunturi);
});

// ✅ POST /api/anunturi - adaugă anunț
router.post('/', verificaToken, (req, res) => {
  const { titlu, descriere, pret, imagineUrl, categorie } = req.body;

  const anuntNou = {
    id: idCounter++,
    titlu,
    descriere,
    pret,
    imagineUrl,
    categorie,
    emailUtilizator: req.utilizator.email,
  };

  anunturi.push(anuntNou);
  res.status(201).json(anuntNou);
});

// ✅ GET /api/anunturi/me - anunțurile utilizatorului logat
router.get('/me', verificaToken, (req, res) => {
  const aleMele = anunturi.filter(a => a.emailUtilizator === req.utilizator.email);
  res.json(aleMele);
});

// ✅ GET /api/anunturi/:id - detalii anunț
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const anunt = anunturi.find(a => a.id === id);
  if (!anunt) return res.status(404).json({ mesaj: 'Anunț negăsit' });
  res.json(anunt);
});

// ✅ PUT /api/anunturi/:id - editează anunț
router.put('/:id', verificaToken, (req, res) => {
  const id = parseInt(req.params.id);
  const anunt = anunturi.find(a => a.id === id && a.emailUtilizator === req.utilizator.email);
  if (!anunt) return res.status(404).json({ mesaj: 'Anunț negăsit' });

  const { titlu, descriere, pret, imagineUrl, categorie } = req.body;
  anunt.titlu = titlu;
  anunt.descriere = descriere;
  anunt.pret = pret;
  anunt.imagineUrl = imagineUrl;
  anunt.categorie = categorie;

  res.json(anunt);
});

// ✅ DELETE /api/anunturi/:id - șterge anunț
router.delete('/:id', verificaToken, (req, res) => {
  const id = parseInt(req.params.id);
  const index = anunturi.findIndex(a => a.id === id && a.emailUtilizator === req.utilizator.email);
  if (index === -1) return res.status(404).json({ mesaj: 'Anunț negăsit' });

  anunturi.splice(index, 1);
  res.json({ mesaj: 'Anunț șters' });
});

module.exports = router;
