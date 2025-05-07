const Cliente = require('../models/clienteModel');

exports.createClienteDirect = async ({ nome, nif}) => {
    const cliente = new Cliente({ nome, nif});
    return await cliente.save();
};
