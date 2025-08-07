const express = require("express");
const router = express.Router();
const Ad = require("../models/Ad");

// LISTĂ anunțuri
router.get("/", async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (error) {
    res.status(500).json({ message: "Eroare la listare anunțuri", error });
  }
});

// DETALII anunț
router.get("/:id", async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Anunț nu găsit" });
    res.json(ad);
  } catch (error) {
    res.status(500).json({ message: "Eroare la preluare anunț", error });
  }
});

// CREARE anunț
router.post("/", async (req, res) => {
  try {
    const { title, description, price, image } = req.body;
    if (!title || !description || !price) {
      return res.status(400).json({ message: "Completează toate câmpurile obligatorii." });
    }

    const ad = new Ad({ title, description, price, image });
    await ad.save();
    res.status(201).json(ad);
  } catch (error) {
    res.status(500).json({ message: "Eroare la crearea anunțului", error });
  }
});
<Route path="/edit/:id" element={<EditAnunt />} />

module.exports = router;
