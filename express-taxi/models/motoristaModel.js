// models/motoristaModel.js
const mongoose = require('mongoose');
const PessoaSchema = require('./pessoaModel');
const MoradaSchema = require('./moradaModel');

const MotoristaSchema = new mongoose.Schema({
  ...PessoaSchema.obj, // importa os campos de Pessoa
  anoNascimento: { type: Number, required: true },
  numeroCartaConducao: { type: String, required: true, unique: true },
  morada: { type: MoradaSchema, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Motorista', MotoristaSchema);
