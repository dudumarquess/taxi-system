// models/motoristaModel.js
const mongoose = require('mongoose');
const PessoaSchema = require('./pessoaModel');

const ClienteSchema = new mongoose.Schema({
    ...PessoaSchema.obj, // importa os campos de Pessoa
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
