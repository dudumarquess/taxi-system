const Turno = require('../models/turnoModel');
const asyncHandler = require('express-async-handler');

exports.verificarIntersecoes = asyncHandler(async (req, res) => {
    const { inicio, fim, motoristaId } = req.body;

    console.log('Recebendo requisição para verificar interseções...');
    console.log('Dados recebidos:', { inicio, fim, motoristaId });

    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);

    // Validação de datas
    if (isNaN(inicioDate.getTime()) || isNaN(fimDate.getTime())) {
        console.error('Erro: Datas inválidas.');
        return res.status(400).json({ error: 'Datas inválidas.' });
    }

    if (inicioDate >= fimDate) {
        console.error('Erro: O horário de início deve ser anterior ao horário de fim.');
        return res.status(400).json({ error: 'O horário de início deve ser anterior ao horário de fim.' });
    }

    console.log('Consultando interseções no banco de dados...');
    const intersecoes = await Turno.find({
        motorista: motoristaId,
        inicio: { $lt: fimDate },
        fim: { $gt: inicioDate },
    }).exec();

    console.log('Resultado da consulta:', intersecoes);

    if (intersecoes.length > 0) {
        console.log('Interseções encontradas.');
        return res.status(200).json(true);
    }

    console.log('Nenhuma interseção encontrada.');
    res.status(200).json(false);
});
exports.listarTurnos = asyncHandler(async (req, res) => {
    const turnos = await Turno.find()
        .sort({ inicio: 1 })
        .exec();

    res.status(200).json(turnos); // Retorna os turnos encontrados
});