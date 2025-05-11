const Motorista = require('../models/motoristaModel');
const { validarMotorista } = require('../validations/motoristaValidation');
const { obterLocalidadePorCodigoPostal } = require('../controllers/localidadeController');
const PedidoCliente = require('../models/pedidoClienteModel');
const Turno = require('../models/turnoModel');
const asyncHandler = require('express-async-handler');

exports.registarMotorista = async (req, res) => {
  try {
    const dados = req.body;
    console.log('Received Data:', dados);

    const erros = validarMotorista(dados);
    if (erros.length > 0) {
      return res.status(400).json({ erro: 'Erro de validação', detalhes: erros });
    }

    if (!dados.morada || !dados.morada.codigoPostal || !dados.morada.rua || !dados.morada.numeroPorta) {
      return res.status(400).json({
        erro: 'Dados de morada incompletos',
        detalhes: { morada: dados.morada || 'Morada não fornecida' },
      });
    }

    const motoristaComMesmoNif = await Motorista.findOne({ nif: dados.nif });
    if (motoristaComMesmoNif) {
      return res.status(400).json({ erro: 'Nif já existe', detalhes: 'nif' });
    }

    const motoristaComMesmoNumeroCarta = await Motorista.findOne({ numeroCartaConducao: dados.numeroCartaConducao });
    if (motoristaComMesmoNumeroCarta) {
      return res.status(400).json({ erro: 'Carta de condução já existe', detalhes: 'numeroCartaConducao' });
    }

    const localidade = await obterLocalidadePorCodigoPostal(dados.morada.codigoPostal);
    if (!localidade) {
      return res.status(400).json({
        erro: 'Código postal inválido',
        detalhes: { codigoPostal: dados.morada.codigoPostal },
      });
    }

    dados.morada.localidade = localidade;

    const novoMotorista = new Motorista(dados);
    await novoMotorista.save();

    console.log('Motorista Saved Successfully:', novoMotorista);
    res.status(201).json(novoMotorista);
  } catch (err) {
    console.error('Unexpected Error:', err);
    res.status(500).json({ erro: 'Erro ao registar motorista', detalhes: err.message });
  }
};

exports.listarMotoristas = async (req, res) => {
  try {
    const motoristas = await Motorista.find().sort({ criadoEm: -1 });
    res.json(motoristas);
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao listar motoristas', detalhes: err.message });
  }
};

exports.loginMotorista = async (req, res) => {
  try {
    const { nif } = req.body;
    if (!nif) {
      return res.status(400).json({ message: "NIF é obrigatório." });
    }

    if (/^\d{9}$/.test(nif)) {
      const motorista = await Motorista.findOne({ nif });
      if (!motorista) {
        return res.status(404).json({ message: 'Motorista não encontrado' });
      }

      console.log(`Login bem-sucedido para o motorista com NIF ${nif}.`);
      res.status(200).json({ motorista });
    } else {
      return res.status(400).json({ message: 'NIF inválido. Deve ter 9 dígitos.' });
    }
  } catch (error) {
    console.error("Erro interno do servidor:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
};

exports.getPedidoAtual = async (req, res) => {
  const { motoristaId } = req.params;

  const pedido = await PedidoCliente.findOne({
    motorista: motoristaId,
    status: { $in: ['aceito_pelo_cliente', 'em_viagem'] } // Inclui os dois status
  }).populate('cliente');

  if (!pedido) {
    return res.status(404).json({ message: 'Nenhum pedido ativo encontrado' });
  }

  res.json(pedido);
};

exports.getTurnoAtual = async (req, res) => {
  const { motoristaId } = req.params;
  const now = new Date();

  const turno = await Turno.findOne({
    motorista: motoristaId,
    inicio: { $lte: now },
    fim: { $gt: now }
  })
      .populate('taxi')
      .populate('motorista');

  if (!turno) {
    return res.status(404).json({ message: 'Nenhum turno ativo encontrado' });
  }

  res.json(turno);
};


const getTurnoAtualFuncao = async (motoristaId) => {
  const now = new Date();

  const turno = await Turno.findOne({
    motorista: motoristaId,
    inicio: { $lte: now },
    fim: { $gt: now }
  });

  if (!turno) {
    throw new Error('Nenhum turno ativo encontrado');
  }

  return turno;
};

module.exports.getTurnoAtualFuncao = getTurnoAtualFuncao;
