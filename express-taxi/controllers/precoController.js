const Preco = require('../models/precoModel');
const asyncHandler = require('express-async-handler');

exports.definirPreco = asyncHandler(async (req, res) => {
  const { nivelConforto, precoPorMinuto, acrescimoNoturno } = req.body;

  const precoExistente = await Preco.findOne({ nivelConforto });
  if (precoExistente) {
    precoExistente.precoPorMinuto = precoPorMinuto;
    precoExistente.acrescimoNoturno = acrescimoNoturno;
    await precoExistente.save();
    return res.status(200).json(precoExistente);
  }

  const novoPreco = new Preco({ nivelConforto, precoPorMinuto, acrescimoNoturno });
  await novoPreco.save();
  res.status(201).json(novoPreco);
});

exports.listarPrecos = asyncHandler(async (req, res) => {
  const precos = await Preco.find();
  res.status(200).json(precos);
});