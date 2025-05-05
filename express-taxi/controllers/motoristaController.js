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

    const motoristaComMesmoNif = await Motorista.findOne({ nif: dados.nif });
    if (motoristaComMesmoNif) {
      return res.status(400).json({
        erro: 'Nif já existe',
        detalhes: 'nif',
      });
    }

    const motoristaComMesmoNumeroCarta = await Motorista.findOne({ numeroCartaConducao: dados.numeroCartaConducao });
    if (motoristaComMesmoNumeroCarta) {
      return res.status(400).json({
        erro: 'carta de condução já existe',
        detalhes: 'numeroCartaConducao'
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

exports.loginMotorista = async (req, res) => {
  try {
    const { nif } = req.body;
    if (!nif) {
      console.error("Erro: NIF não fornecido.");
      return res.status(400).json({ message: "NIF é obrigatório." });
    }

    if (/^\d{9}$/.test(nif)) {
      const motorista = await Motorista.findOne({ nif });
      if (!motorista) {
        console.error(`Erro: Motorista com NIF ${nif} não encontrado.`);
        return res.status(404).json({ message: 'Motorista não encontrado' });
      }

      console.log(`Login bem-sucedido para o motorista com NIF ${nif}.`);
      res.status(200).json({ motorista });
    } else {
      console.error(`Erro: NIF ${nif} é inválido. Deve ter 9 dígitos.`);
      return res.status(400).json({ message: 'NIF inválido. Deve ter 9 dígitos.' });
    }
  } catch (error) {
    console.error("Erro interno do servidor:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}