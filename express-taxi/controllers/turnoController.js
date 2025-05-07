const Turno = require('../models/turnoModel');
const Motorista = require('../models/motoristaModel');
const Taxi = require('../models/taxiModel');	
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
    const { motoristaId } = req.query;

    if(!motoristaId) {
        return res.status(400).json({ error: 'O ID do motorista é obrigatório.' });
    }
    
    const turnos = await Turno.find({ motorista: motoristaId })
        .populate('taxi', 'matricula')
        .sort({ inicio: 1 })
        .exec();

    console.log('turnos encontrados:', turnos);
    res.status(200).json(turnos); // Retorna os turnos encontrados
});

exports.turno_post = asyncHandler(async (req, res) => {
    const { motoristaId, inicio, fim, taxiId } = req.body;
    console.log('Dados recebidos:', { motoristaId, inicio, fim, taxiId });

    if (!motoristaId || !inicio || !fim || !taxiId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);
    const now = new Date();

    if (isNaN(inicioDate.getTime()) || isNaN(fimDate.getTime())) {
        return res.status(400).json({ error: 'Datas inválidas.' });
    }
    if(inicioDate >= fimDate) {
        return res.status(400).json({ error: 'O horário de início deve ser anterior ao horário de fim.' });
    }
    const duration = (fimDate - inicioDate) / (1000 * 60 * 60); 
    if (duration > 8) {
        return res.status(400).json({ error: 'O turno não pode ser maior que 8 horas.' });
    }
    if (inicioDate <= now) {
        return res.status(400).json({ error: 'O inicio deve ser depois da hora atual' });
    }

    const motoristaExistente = await Motorista.findById(motoristaId);
    if (!motoristaExistente) {
        return res.status(404).json({ error: 'Motorista não encontrado.' });
    }
    const taxiExistente = await Taxi.findById(taxiId);

    const intersecoes = await Turno.find({
        motorista: motoristaId,
        inicio: { $lt: fimDate },
        fim: { $gt: inicioDate },
    }).exec();

    if (intersecoes.length > 0) {
        return res.status(400).json({ error: 'O motorista já tem um turno nesse horário.' });
    }

    const novoTurno = new Turno({
        motorista: motoristaId,
        inicio: inicioDate,
        fim: fimDate,
        taxi: taxiId,
    });

    await novoTurno.save();
    console.log('Novo turno criado:', novoTurno);
    res.status(201).json({message: 'turno criado com sucesso', turno: novoTurno}); // Retorna o turno criado
});