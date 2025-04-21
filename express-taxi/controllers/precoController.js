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

exports.calcularCustoViagem = asyncHandler(async (req, res) => {
  const { nivelConforto, inicio, fim } = req.body;

  // Buscar o preço por minuto e acréscimo noturno para o nível de conforto
  const precoConfig = await Preco.findOne({ nivelConforto });
  if (!precoConfig) {
    return res.status(404).json({ error: 'Configuração de preço não encontrada' });
  }

  const precoPorMinuto = precoConfig.precoPorMinuto;
  const acrescimoNoturno = precoConfig.acrescimoNoturno;

  const inicioDate = new Date(inicio);
  const fimDate = new Date(fim);

  if (inicioDate >= fimDate) {
    return res.status(400).json({ error: 'O horário de início deve ser anterior ao horário de fim' });
  }

  let custoTotal = 0;
  let current = new Date(inicioDate);

  while (current < fimDate) {
    const hora = current.getHours();
    const isNoturno = hora >= 21 || hora < 6;

    const proximoMinuto = new Date(current.getTime() + 60000); // Próximo minuto
    if (proximoMinuto > fimDate) {
      break;
    }

    custoTotal += precoPorMinuto * (isNoturno ? 1 + acrescimoNoturno / 100 : 1);
    current = proximoMinuto;
  }

  res.status(200).json({ custoTotal: custoTotal.toFixed(2) });
});