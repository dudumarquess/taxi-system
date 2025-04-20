const mongoose = require('mongoose');

const PrecoSchema = new mongoose.Schema({
  nivelConforto: { type: String, enum: ['básico', 'luxuoso'], required: true, unique: true },
  precoPorMinuto: { type: Number, required: true, min: 0.01 }, //preco tem de ser maior que 0
  acrescimoNoturno: { type: Number, required: true, min: 0 }, // Percentual (ex: 20 para 20%)
});

module.exports = mongoose.model('Preco', PrecoSchema);