const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// ✅ FIX CORS pentru Netlify
app.use(cors({
  origin: "https://ebay-anunturi.ro",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB conectat"))
  .catch(err => console.error("Eroare MongoDB:", err));

// ✅ Model User
const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  parola: String
}));

// ✅ Model Anunt
const Anunt = mongoose.model("Anunt", new mongoose.Schema({
  titlu: String,
  descriere: String,
  pret: Number,
  imagine: String,
  categorie: String,
  userId: String
}));

// ✅ Middleware pentru autentificare
function autentificare(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ mesaj: "Token lipsă" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ mesaj: "Token invalid" });
    req.userId = decoded.id;
    next();
  });
}

// ✅ Multer pentru upload imagini
const upload = multer({ dest: "uploads/" });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ API Login
app.post("/api/login", async (req, res) => {
  const { email, parola } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(parola, user.parola))) {
    return res.status(401).json({ mesaj: "Email sau parolă incorecte" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
});

// ✅ API Înregistrare
app.post("/api/inregistrare", async (req, res) => {
  const { email, parola } = req.body;
  const parolaHash = await bcrypt.hash(parola, 10);
  const user = new User({ email, parola: parolaHash });
  await user.save();
  res.json({ mesaj: "Utilizator înregistrat" });
});

// ✅ API Creare Anunț
app.post("/api/anunturi", autentificare, upload.single("imagine"), async (req, res) => {
  const imagineUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  const anunt = new Anunt({ ...req.body, imagine: imagineUrl, userId: req.userId });
  await anunt.save();
  res.json(anunt);
});

// ✅ API Listare Toate Anunțurile
app.get("/api/anunturi", async (req, res) => {
  const anunturi = await Anunt.find();
  res.json(anunturi);
});

// ✅ API Anunțurile Mele
app.get("/api/anunturile-mele", autentificare, async (req, res) => {
  const anunturi = await Anunt.find({ userId: req.userId });
  res.json(anunturi);
});

// ✅ API Ștergere
app.delete("/api/anunturi/:id", autentificare, async (req, res) => {
  const anunt = await Anunt.findById(req.params.id);
  if (anunt.userId !== req.userId) return res.sendStatus(403);
  await anunt.remove();
  res.json({ mesaj: "Anunț șters" });
});

// ✅ API Editare
app.put("/api/anunturi/:id", autentificare, upload.single("imagine"), async (req, res) => {
  const anunt = await Anunt.findById(req.params.id);
  if (!anunt || anunt.userId !== req.userId) return res.sendStatus(403);

  anunt.titlu = req.body.titlu;
  anunt.descriere = req.body.descriere;
  anunt.pret = req.body.pret;
  anunt.categorie = req.body.categorie;

  if (req.file) {
    const imagineUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    anunt.imagine = imagineUrl;
  }

  await anunt.save();
  res.json(anunt);
});

// ✅ Pornire server
app.listen(PORT, () => {
  console.log(`Server pornit pe portul ${PORT}`);
});
