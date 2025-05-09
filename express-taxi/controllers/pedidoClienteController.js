const asyncHandler = require('express-async-handler');
const PedidoCliente = require('../models/pedidoClienteModel');
const Cliente = require('../models/clienteModel');
const clienteController = require('./clienteController');
const axios = require('axios');



// POST /api/pedidos
exports.criarPedido = asyncHandler(async (req, res) => {
     console.log('REQ.BODY:', req.body) //so para debug

    const {
        cliente: { nome, nif, genero },
        origem,
        destino,
        nivelConforto,
        numeroPessoas
    } = req.body;

    const nifN = parseInt(req.body.cliente.nif, 10)

    if (!nifN || !nome || !genero) {
        res.status(400);
        throw new Error('Dados do cliente incompletos');
    }

    let cliente = await Cliente.findOne({ nif: nifN });

    if (cliente) {
        const pedidoAtivo = await PedidoCliente.findOne({
            cliente: cliente._id,
            status: { $in: ['pendente_motorista', 'pendente_cliente', 'em andamento'] }
        });

        if (pedidoAtivo) {
            res.status(409);
            throw new Error('Já existe um pedido ativo para este cliente');
        }
    }

    let clienteCriadoAgora = false;

    if (!cliente) {
        cliente = new Cliente({ nome, nif: nifN, genero });
        await cliente.save();
        clienteCriadoAgora = true;
    }

    const origemCoords = await geocodeEndereco(origem.rua, origem.cidade);

    try {
        const novoPedido = new PedidoCliente({
            cliente: cliente._id,
            origem: {
                ...origem,
                lat: origemCoords.lat,
                lng: origemCoords.lng
            },
            destino,
            nivelConforto,
            numeroPessoas
        });

        await novoPedido.save();
        res.status(201).json(novoPedido);
    } catch (err) {
        if (clienteCriadoAgora) {
            await Cliente.deleteOne({ _id: cliente._id });
        }
        throw new Error('Erro ao criar o pedido: ' + err.message);
    }
});


exports.listarPedidos = asyncHandler(async (req, res) => {
    const pedidos = await PedidoCliente.find()
        .populate('cliente')
        .sort({ dataPedido: -1 });

    res.status(200).json(pedidos);
});

exports.buscarPedidoNif = asyncHandler(async (req, res) => {
    const { nif } = req.params;

    // Buscar o cliente pelo NIF
    const cliente = await Cliente.findOne({ nif });
    if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Buscar os pedidos do cliente
    const pedidos = await PedidoCliente.find({ cliente: cliente._id }).sort({ dataPedido: -1 });

    if (!pedidos || pedidos.length === 0) {
        return res.status(404).json({ message: 'Nenhum pedido encontrado para este cliente' });
    }

    res.status(200).json(pedidos);
});

async function geocodeEndereco(rua, cidade) {
  const url = `https://nominatim.openstreetmap.org/search?street=${encodeURIComponent(rua)}&city=${encodeURIComponent(cidade)}&country=Portugal&format=json&limit=1`;
  const resp = await axios.get(url, { headers: { 'User-Agent': 'TaxiSystem/1.0' } });
  if (resp.data && resp.data.length > 0) {
    return {
      lat: parseFloat(resp.data[0].lat),
      lng: parseFloat(resp.data[0].lon)
    };
  }
}