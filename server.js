require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conectare la MongoDB Atlas folosind variabila de mediu
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Conectat la MongoDB Atlas"))
  .catch((err) => console.error("Eroare conectare MongoDB:", err));

// Definirea schemei pentru anunțuri
const anuntSchema = new mongoose.Schema({
  titlu: String,
  descriere: String,
  pret: Number,
  userId: String,
  dataPostarii: { type: Date, default: Date.now },
});

// Modelul pentru anunțuri
const Anunt = mongoose.model("Anunt", anuntSchema);

// Ruta GET pentru a obține toate anunțurile
app.get("/api/anunturi", async (req, res) => {
  try {
    const anunturi = await Anunt.find().sort({ dataPostarii: -1 });
    res.json(anunturi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta POST pentru a adăuga un anunț nou
app.post("/api/anunturi", async (req, res) => {
  try {
    const { titlu, descriere, pret, userId } = req.body;
    const newAnunt = new Anunt({ titlu, descriere, pret, userId });
    await newAnunt.save();
    res.status(201).json(newAnunt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Pornirea serverului pe portul configurat sau 5000 implicit
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server pornit pe portul ${PORT}`));
