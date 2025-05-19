const Taxi = require("../models/taxiModel");
const Turno = require("../models/turnoModel");

const asyncHandler = require("express-async-handler");

exports.taxi_getById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    Taxi.findById(id)
        .then((taxi) => {
            if (!taxi) {
                return res.status(404).json({ message: 'Táxi não encontrado.' });
            }
            res.status(200).json(taxi);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: 'Erro ao buscar o táxi.', error: err });
        });
})


exports.taxi_edit = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const taxiData = req.body;

    console.log('Recebido pedido para editar táxi');
    console.log('ID recebido:', id);
    console.log('Dados recebidos:', JSON.stringify(taxiData));

    try {
        const existingTaxi = await Taxi.findById(id);

        if (!existingTaxi) {
            return res.status(404).json({ error: 'Táxi não encontrado.' });
        }
        if(existingTaxi.temViagem && taxiData.nivel_conforto !== existingTaxi.nivel_conforto){
            return res.status(400).json({ error: 'Não pode mudar o nível de conforto. Taxi já fez viagem.' });
        }

        taxiData.updatedAt = new Date();

        const updatedTaxi = await Taxi.findByIdAndUpdate(
            id,
            taxiData,
            { new: true }
        );

        if (!updatedTaxi) {
            return res.status(404).json({ error: 'Táxi não encontrado durante atualização.' });
        }

        res.json(updatedTaxi);
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ error: 'ID do táxi em formato inválido.' });
        }
        return res.status(500).json({ error: `Erro ao atualizar o táxi: ${error.message}` });
    }
});

exports.taxi_get_all = asyncHandler(async (req, res) => {
    try {
        const allTaxis = await Taxi.find({}).sort({ updatedAt: -1 })
        res.status(200).json(allTaxis);
    }catch (error) {
        res.status(500).json({ error: `Erro ao buscar os táxis: ${error.message}` });
    }

});

exports.taxi_delete = asyncHandler(async (req, res) => {
    const taxi = await Taxi.findByIdAndDelete(req.params.id).exec();
    if (!Taxi) {
        const err = new Error("Taxi not found");
        res.status(404).json({err})
    }
    else
        res.status(200).json({})
})

exports.taxi_post = asyncHandler(async (req, res) => {
    const {matricula, marca, modelo, ano_compra, nivel_conforto, quilometragem_total} = req.body;

    const mat = matricula.toUpperCase().trim();

    if(!validarMatricula(mat)){
        const err = new Error("Matricula invalida");
        return res.status(400).json(err);
    }

    const exists = await Taxi.findOne({ matricula: mat}).exec();
    if(exists){
        const err = new Error("Matricula já existe");
        return res.status(400).json(err);
    }

    if(ano_compra > new Date().getFullYear()){
        const err = new Error("Ano de compra inválido");
        return res.status(400).json(err);
    }

    const newTaxi = new Taxi({
        matricula: mat,
        marca: marca,
        modelo: modelo,
        ano_compra: ano_compra,
        nivel_conforto: nivel_conforto,
        quilometragem_total: quilometragem_total,
    });

    const savedTaxi = await newTaxi.save();
    return res.status(201).json(savedTaxi);
});

function validarMatricula(matricula) {
    if (!matricula || typeof matricula !== 'string') return false;


    // Regex that verifies if it is in format XX-XX-XX
    const regex = /^([A-Z0-9]{2})-([A-Z0-9]{2})-([A-Z0-9]{2})$/;
    const match = matricula.match(regex);
    if (!match) return false;

    //Put the matricula into groups
    const grupos = [match[1], match[2], match[3]];

    // Now verifies if each group is either AA or 11 (numbers and letter grouped)
    const tipos = grupos.map(grupo => {
        if (/^[A-Z]{2}$/.test(grupo)) return 'letras';
        if (/^[0-9]{2}$/.test(grupo)) return 'numeros';
        return 'invalido';
    });

    if (tipos.includes('invalido')) return false;

    // If it is either only number or letters, return false
    const conjuntoTipos = new Set(tipos);
    if (conjuntoTipos.size === 1) return false;

    return true;
}

exports.taxi_disponiveis_post = asyncHandler(async (req, res) => {
    const { inicio, fim } = req.body;

    console.log('Recebendo requisição para verificar táxis disponíveis...');
    console.log('Dados recebidos:', { inicio, fim });

    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);

    if (isNaN(inicioDate.getTime()) || isNaN(fimDate.getTime())) {
        console.error('Erro: Datas inválidas.');
        return res.status(400).json({ error: 'Datas inválidas.' });
    }

    if (inicioDate >= fimDate) {
        console.error('Erro: O horário de início deve ser anterior ao horário de fim.');
        return res.status(400).json({ error: 'O horário de início deve ser anterior ao horário de fim.' });
    }

    console.log('Consultando turnos que intersetam o intervalo no banco de dados...');

    const intersecoes = await Turno.find({
        inicio: { $lt: fimDate },
        fim: { $gt: inicioDate },
    }).exec();

    console.log('Resultado da consulta:', intersecoes);

    const taxisIndisponiveis = intersecoes.map(turno => turno.taxi);

    console.log('Táxis indisponíveis:', taxisIndisponiveis);

    const taxisDisponiveis = await Taxi.find({
        _id: { $nin: taxisIndisponiveis },
    }).exec();

    console.log('Taxis disponíveis:', taxisDisponiveis);

    res.status(200).json(taxisDisponiveis); 
});
