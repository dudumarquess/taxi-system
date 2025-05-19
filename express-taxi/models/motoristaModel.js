// models/motoristaModel.js
const mongoose = require('mongoose');
const PessoaSchema = require('./pessoaModel');
const MoradaSchema = require('./moradaModel');

const MotoristaSchema = new mongoose.Schema({
  ...PessoaSchema.obj, // importa os campos de Pessoa
  anoNascimento: { type: Number, required: true },
  numeroCartaConducao: { type: String, required: true, unique: true },
  morada: { type: MoradaSchema, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  jaRequisitou: { type: Boolean, default: false }
});

module.exports = mongoose.model('Motorista', MotoristaSchema);
