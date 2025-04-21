const Taxi = require("../models/taxiModel");

const asyncHandler = require("express-async-handler");

exports.taxi_get_all = asyncHandler(async (req, res) => {
    const allTaxis = await Taxi.find({})
        .sort({ _id: 1 })
        .exec();

    res.status(200).json(allTaxis);
});

exports.taxi_post = asyncHandler(async (req, res) => {
    const {matricula, marca, modelo, ano_compra, nivel_conforto, quilometragem} = req.body;

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
        quilometragem: quilometragem,
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
