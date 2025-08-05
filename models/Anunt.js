import mongoose from 'mongoose';

const AnuntSchema = new mongoose.Schema({
  titlu: { type: String, required: true },
  descriere: { type: String, required: true },
  pret: { type: Number, required: true },
  data: { type: Date, default: Date.now }
});

export default mongoose.model('Anunt', AnuntSchema);
