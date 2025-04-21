const Motorista = require('../models/motoristaModel');

exports.validarMotorista = async (dados) => {
    const erros = [];
  
    // RIA 6: Ano de nascimento >= 18 anos
    const idade = new Date().getFullYear() - dados.anoNascimento;
    if (idade < 18) erros.push('Motorista deve ter pelo menos 18 anos');
  
    // RIA 10: NIF deve ter 9 dígitos
    if (!/^\d{9}$/.test(dados.nif)) erros.push('NIF inválido');
  
    // RIA 11: Género deve ser um dos válidos
    if (!['masculino', 'feminino'].includes(dados.genero)) erros.push('Género inválido');
    
    // RIA 12: Número de carta de condução deve identificar o motorista
    // Verifica se o número da carta de condução já existe
    const motoristaExistente = await Motorista.findOne({ numeroCartaConducao: dados.numeroCartaConducao });
    if (motoristaExistente) {
        erros.push('Número da carta de condução já está em uso');
    }
    
  
    return erros;
};
  