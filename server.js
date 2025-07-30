require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Conectat la MongoDB Atlas"))
  .catch((err) => console.error("Eroare conectare MongoDB:", err));

const anuntSchema = new mongoose.Schema({
  titlu: String,
  descriere: String,
  pret: Number,
  userId: String,
  dataPostarii: { type: Date, default: Date.now },
});

const Anunt = mongoose.model("Anunt", anuntSchema);

app.get("/api/anunturi", async (req, res) => {
  try {
    const anunturi = await Anunt.find().sort({ dataPostarii: -1 });
    res.json(anunturi);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server pornit pe portul ${PORT}`));
