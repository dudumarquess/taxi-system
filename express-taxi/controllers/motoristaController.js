const Motorista = require('../models/motoristaModel');
const { validarMotorista } = require('../validations/motoristaValidation');
const { obterLocalidadePorCodigoPostal } = require('../services/localidadeService');

exports.registarMotorista = async (req, res) => {
  try {
    const dados = req.body;

    const erros = validarMotorista(dados);
    if (erros.length > 0) return res.status(400).json({ erros });

    // Obter localidade automaticamente
    const localidade = await obterLocalidadePorCodigoPostal(dados.morada.codigoPostal);
    if (!localidade) return res.status(400).json({ erro: 'Código postal inválido' });

    dados.morada.localidade = localidade;

    const novoMotorista = new Motorista(dados);
    await novoMotorista.save();

    res.status(201).json(novoMotorista);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao registar motorista' });
  }
};

exports.listarMotoristas = async (req, res) => {
  const motoristas = await Motorista.find().sort({ criadoEm: -1 });
  res.json(motoristas);
};
