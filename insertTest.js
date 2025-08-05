const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ebayanunturi")
  .then(() => {
    console.log("Conectat la MongoDB");
  })
  .catch(err => {
    console.error("Eroare conectare:", err);
  });

const anuntSchema = new mongoose.Schema({
  titlu: String,
  descriere: String,
  pret: Number,
  userId: String,
  dataPostarii: { type: Date, default: Date.now },
});

const Anunt = mongoose.model("Anunt", anuntSchema);

async function insertAnunt() {
  try {
    const anunt = new Anunt({
      titlu: "Anunț test CMD",
      descriere: "Descriere test inserată din CMD",
      pret: 123,
      userId: "test-cmd",
    });
    await anunt.save();
    console.log("Anunț creat cu succes!");
  } catch (err) {
    console.error("Eroare la inserare:", err);
  } finally {
    mongoose.disconnect();
  }
}

insertAnunt();
