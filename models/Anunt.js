const anuntSchema = new mongoose.Schema({
  titlu: String,
  descriere: String,
  pret: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  dataPostarii: { type: Date, default: Date.now },
  blocat: { type: Boolean, default: false } // <-- nou
});
