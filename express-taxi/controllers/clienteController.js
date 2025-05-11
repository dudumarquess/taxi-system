const Cliente = require('../models/clienteModel');
const asyncHandler = require('express-async-handler');

exports.createClienteDirect = async ({ nome, nif}) => {
    const cliente = new Cliente({ nome, nif});
    return await cliente.save();
};

exports.listarClientes = asyncHandler(async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ nome: 1 }); // Ordenar por nome
    res.json(clientes);
  } catch (err) {
    console.error('Erro ao listar clientes:', err);
    res.status(500).json({ error: 'Erro ao listar clientes' });
  }
});

exports.buscarOuCriarCliente = asyncHandler(async (req, res) => {
  const { nome, nif, genero } = req.body;

  if (!nome || !nif) {
    return res.status(400).json({ error: 'Nome e NIF são obrigatórios.' });
  }

  if (!/^\d{9}$/.test(nif)) {
    return res.status(400).json({ error: 'NIF inválido. Deve conter exatamente 9 dígitos.' });
  }

  try {
    let cliente = await Cliente.findOne({ nif });

    if (!cliente) {
      console.log('Cliente não encontrado. Criando novo cliente...');
      cliente = new Cliente({ nome, nif, genero });
      await cliente.save();
    }

    res.status(200).json(cliente);
  } catch (err) {
    console.error('Erro ao buscar ou criar cliente:', err);
    res.status(500).json({ error: 'Erro ao processar a solicitação.' });
  }
});
