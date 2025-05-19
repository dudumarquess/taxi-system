const Motorista = require('../models/motoristaModel');
const { validarMotorista } = require('../validations/motoristaValidation');
const { obterLocalidadePorCodigoPostal } = require('../controllers/localidadeController');
const PedidoCliente = require('../models/pedidoClienteModel');
const Turno = require('../models/turnoModel');
const asyncHandler = require('express-async-handler');

exports.motorista_getById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    Motorista.findById(id)
        .then((motorista) => {
            if (!motorista) {
                return res.status(404).json({ message: 'Motorista não encontrado.' });
            }
            res.status(200).json(motorista);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar o motorista.', error: err });
        });
});

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
    const motoristas = await Motorista.find().sort({ updatedAt: -1 });
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
  })
  .populate('taxi');

  if (!turno) {
    throw new Error('Nenhum turno ativo encontrado');
  }

  return turno;
};

exports.motorista_delete = asyncHandler(async (req, res) => {
  const motorista = await Motorista.findByIdAndDelete(req.params.id).exec();
  if (!motorista) {
    const err = new Error("Motorista not found");
    res.status(404).json({err})
  }
  res.status(200).json({ message: 'Motorista eliminado com sucesso' });
});

exports.motorista_edit = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const motoristaData = req.body;

  console.log('Recebido pedido para editar motorista');
  console.log('ID recebido:', id);
  console.log('Dados recebidos:', JSON.stringify(motoristaData));

  // Validação igual ao registarMotorista
  const erros = validarMotorista(motoristaData);
  if (erros.length > 0) {
    return res.status(400).json({ erro: 'Erro de validação', detalhes: erros });
  }

  if (!motoristaData.morada || !motoristaData.morada.codigoPostal || !motoristaData.morada.rua || !motoristaData.morada.numeroPorta) {
    return res.status(400).json({
      erro: 'Dados de morada incompletos',
      detalhes: { morada: motoristaData.morada || 'Morada não fornecida' },
    });
  }

  // Verifica duplicação de NIF (exceto para o próprio motorista)
  const motoristaComMesmoNif = await Motorista.findOne({ nif: motoristaData.nif, _id: { $ne: id } });
  if (motoristaComMesmoNif) {
    return res.status(400).json({ erro: 'Nif já existe', detalhes: 'nif' });
  }

  // Verifica duplicação de número de carta (exceto para o próprio motorista)
  const motoristaComMesmoNumeroCarta = await Motorista.findOne({ numeroCartaConducao: motoristaData.numeroCartaConducao, _id: { $ne: id } });
  if (motoristaComMesmoNumeroCarta) {
    return res.status(400).json({ erro: 'Carta de condução já existe', detalhes: 'numeroCartaConducao' });
  }

  // Valida localidade
  const localidade = await obterLocalidadePorCodigoPostal(motoristaData.morada.codigoPostal);
  if (!localidade) {
    return res.status(400).json({
      erro: 'Código postal inválido',
      detalhes: { codigoPostal: motoristaData.morada.codigoPostal },
    });
  }
  motoristaData.morada.localidade = localidade;

  try {
    const existingMotorista = await Motorista.findById(id);

    if (!existingMotorista) {
      return res.status(404).json({ error: 'Motorista não encontrado.' });
    }

    motoristaData.updatedAt = new Date();

    const updatedMotorista = await Motorista.findByIdAndUpdate(
      id,
      motoristaData,
      { new: true }
    );

    if (!updatedMotorista) {
      return res.status(404).json({ error: 'Motorista não encontrado durante atualização.' });
    }

    res.json(updatedMotorista);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ error: 'ID do motorista em formato inválido.' });
    }
    return res.status(500).json({ error: `Erro ao atualizar o motorista: ${error.message}` });
  }
});

module.exports.getTurnoAtualFuncao = getTurnoAtualFuncao;
