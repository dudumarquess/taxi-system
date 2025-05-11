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

  const diferencaMinutos = (fimDate - inicioDate) / 60000;
  const horaInicio = inicioDate.getHours();
  const isNoturno = horaInicio >= 21 || horaInicio < 6;

  const custoTotal = diferencaMinutos * precoPorMinuto * (isNoturno ? 1 + acrescimoNoturno / 100 : 1);


  res.status(200).json({ custoTotal: custoTotal.toFixed(2) });
});


const calcularCustoViagemFuncao = async (nivelConforto, inicio, fim) => {

  const precoConfig = await Preco.findOne({ nivelConforto });
  if (!precoConfig) throw new Error('Configuração de preço não encontrada');

  const precoPorMinuto = precoConfig.precoPorMinuto;
  const acrescimoNoturno = precoConfig.acrescimoNoturno;

  const inicioDate = new Date(inicio);
  const fimDate = new Date(fim);

  const diferencaMinutos = (fimDate - inicioDate) / 60000;
  if (diferencaMinutos <= 0) throw new Error('O horário de início deve ser anterior ao horário de fim');

  // Verifica se a viagem começou no período noturno
  const horaInicio = inicioDate.getHours();
  const isNoturno = horaInicio >= 21 || horaInicio < 6;

  const custoTotal = diferencaMinutos * precoPorMinuto * (isNoturno ? 1 + acrescimoNoturno / 100 : 1);

  return custoTotal.toFixed(2);
};


module.exports.calcularCustoViagemFuncao = calcularCustoViagemFuncao;