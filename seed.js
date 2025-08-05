import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Anunt from './models/Anunt.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Anunt.create([
    { titlu: "Telefon iPhone", descriere: "iPhone 13, ca nou", pret: 2500 },
    { titlu: "Laptop Asus", descriere: "i5, 8GB RAM", pret: 1500 }
  ]);

  console.log("Date inserate!");
  process.exit();
});
