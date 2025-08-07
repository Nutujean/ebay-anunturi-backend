const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectat la MongoDB"))
  .catch(err => console.error("❌ Eroare conectare:", err));

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  parola: String,
});

const User = mongoose.model("User", userSchema);

(async () => {
  const email = "admin@email.com";
  const parola = "123456";

  try {
    console.log("🔄 Șterg utilizatorii existenți...");
    await User.deleteMany({});
    
    console.log("🔐 Generez parolă hash...");
    const parolaHash = await bcrypt.hash(parola, 10);

    console.log("📥 Creez utilizator...");
    const user = await User.create({ email, parola: parolaHash });

    console.log("✅ Utilizator creat cu succes:");
    console.log("Email:", email);
    console.log("Parola:", parola);
  } catch (err) {
    console.error("❌ Eroare:", err.message);
  } finally {
    mongoose.disconnect();
  }
})();
