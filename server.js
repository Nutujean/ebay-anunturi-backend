require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors({app.get("/api/test", (req, res) => {
  res.json({ mesaj: "Backend funcționează corect ✅" });
});
  origin: "*", // poți pune și domeniul tău ex: http://localhost:5173
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Conectare MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectat la MongoDB Atlas"))
  .catch(console.error);

// MODELE

// User
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  parola: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// Anunț
const anuntSchema = new mongoose.Schema({
  titlu: String,
  descriere: String,
  pret: Number,
  categorie: String,
  imagine: String,
});
const Anunt = mongoose.model("Anunt", anuntSchema);

// MULTER pentru upload imagine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Servire folder imagini
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ========================= ROUTE: REGISTER =========================
app.post("/api/register", async (req, res) => {
  try {
    const { email, parola } = req.body;
    const parolaHash = await bcrypt.hash(parola, 10);
    const user = new User({ email, parola: parolaHash });
    await user.save();
    res.status(201).json({ message: "Utilizator înregistrat cu succes" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la înregistrare" });
  }
});

// ========================= ROUTE: LOGIN =========================
app.post("/api/login", async (req, res) => {
  try {
    const { email, parola } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Utilizator inexistent" });

    const parolaOk = await bcrypt.compare(parola, user.parola);
    if (!parolaOk) return res.status(401).json({ message: "Parolă greșită" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la autentificare" });
  }
});

// ========================= ROUTE: ADAUGARE ANUNȚ =========================
app.post("/api/anunturi", upload.single("imagine"), async (req, res) => {
  try {
    const { titlu, descriere, pret, categorie } = req.body;
    const imagine = req.file ? "/uploads/" + req.file.filename : "";

    const anuntNou = new Anunt({ titlu, descriere, pret, categorie, imagine });
    await anuntNou.save();
    res.json(anuntNou);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Eroare la creare anunț" });
  }
});

// ========================= PORNIRE SERVER =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server pornit pe portul ${PORT}`));
