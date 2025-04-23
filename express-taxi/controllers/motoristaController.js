const Motorista = require('../models/motoristaModel');
const { validarMotorista } = require('../validations/motoristaValidation');
const { obterLocalidadePorCodigoPostal } = require('../controllers/localidadeController');

exports.registarMotorista = async (req, res) => {
  try {
    const dados = req.body;

    console.log('Received Data:', dados); // Log the received data for debugging

    // Validate motorista data
    const erros = validarMotorista(dados);
    if (erros.length > 0) {
      console.error('Validation Errors:', erros); // Log validation errors
      return res.status(400).json({ erro: 'Erro de validação', detalhes: erros });
    }

    // Validate morada fields
    if (!dados.morada || !dados.morada.codigoPostal || !dados.morada.rua || !dados.morada.numeroPorta) {
      console.error('Morada Validation Failed:', dados.morada); // Log incomplete morada data
      return res.status(400).json({
        erro: 'Dados de morada incompletos',
        detalhes: {
          morada: dados.morada || 'Morada não fornecida',
        },
      });
    }

    // Fetch localidade based on postal code
    const localidade = await obterLocalidadePorCodigoPostal(dados.morada.codigoPostal);
    if (localidade === null) {
      console.error('Invalid Postal Code:', dados.morada.codigoPostal); // Log invalid postal code
      return res.status(400).json({
        erro: 'Código postal inválido',
        detalhes: {
          codigoPostal: dados.morada.codigoPostal,
        },
      });
    }

    dados.morada.localidade = localidade;

    // Save motorista to the database
    const novoMotorista = new Motorista(dados);
    await novoMotorista.save();

    console.log('Motorista Saved Successfully:', novoMotorista); // Log the saved motorista
    res.status(201).json(novoMotorista);
  } catch (err) {
    console.error('Unexpected Error:', err); // Log unexpected errors
    res.status(500).json({
      erro: 'Erro ao registar motorista',
      detalhes: err.message,
    });
  }
};

exports.listarMotoristas = async (req, res) => {
  try {
    const motoristas = await Motorista.find().sort({ criadoEm: -1 });
    console.log('Motoristas Retrieved:', motoristas); // Log retrieved motoristas
    res.json(motoristas);
  } catch (err) {
    console.error('Error Listing Motoristas:', err); // Log errors during listing
    res.status(500).json({
      erro: 'Erro ao listar motoristas',
      detalhes: err.message,
    });
  }
};