// create-user.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ Conectat la MongoDB");
}).catch((err) => {
  console.error("❌ Conectare eșuată:", err.message);
});

const User = mongoose.model("User", new mongoose.Schema({
  email: { type: String, unique: true },
  parola: String,
}));

(async () => {
  const email = "admin@email.com";
  const parola = "123456";
  const parolaHash = await bcrypt.hash(parola, 10);

  try {
    const user = await User.create({ email, parola: parolaHash });
    console.log("✅ Utilizator creat:", user.email);
  } catch (err) {
    console.error("❌ Eroare la creare utilizator:", err.message);
  } finally {
    mongoose.disconnect();
  }
})();
