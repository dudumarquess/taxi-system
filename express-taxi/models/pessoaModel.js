// models/pessoaModel.js
const mongoose = require('mongoose');

const PessoaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  nif: { type: Number, required: true, unique: true },
  genero: { type: String, enum: ['masculino', 'feminino'], required: true }
}, { _id: false }); // _id: false para evitar _id extra quando usado como subdocumento(motorista e passageiro)

module.exports = PessoaSchema;
