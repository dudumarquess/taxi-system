// models/moradaModel.js
const mongoose = require('mongoose');

//duvida presença do id
const MoradaSchema = new mongoose.Schema({
  rua: { type: String, required: true },
  codigoPostal: { type: String, required: true },
  localidade: { type: String },
  numeroPorta: { type: Number, required: true }
}, { _id: false });

module.exports = MoradaSchema;
