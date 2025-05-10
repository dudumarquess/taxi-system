const asyncHandler = require('express-async-handler');
const PedidoCliente = require('../models/pedidoClienteModel');
const Cliente = require('../models/clienteModel');
const clienteController = require('./clienteController');
const axios = require('axios');



// POST /api/pedidos
exports.criarPedido = asyncHandler(async (req, res) => {
    console.log('REQ.BODY:', req.body); // Log para debug

    const {
        cliente: { nome, nif, genero },
        origem,
        destino,
        nivelConforto,
        numeroPessoas
    } = req.body;

    const nifN = parseInt(req.body.cliente.nif, 10);

    // Verificar se os dados do cliente estão completos
    if (!nifN || !nome || !genero) {
        res.status(400).json({ error: 'Dados do cliente incompletos.' });
        return;
    }

    let cliente = await Cliente.findOne({ nif: nifN });

    // Verificar se já existe um pedido ativo para o cliente
    if (cliente) {
        const pedidoAtivo = await PedidoCliente.findOne({
            cliente: cliente._id,
            status: { $in: ['pendente_motorista', 'pendente_cliente', 'em andamento'] }
        });

        if (pedidoAtivo) {
            res.status(409).json({ error: 'Já existe um pedido ativo para este cliente.' });
            return;
        }
    }

    let clienteCriadoAgora = false;

    // Criar cliente se não existir
    if (!cliente) {
        cliente = new Cliente({ nome, nif: nifN, genero });
        await cliente.save();
        clienteCriadoAgora = true;
    }

    // Verificar se a origem é válida
    const origemCoords = await geocodeEndereco(origem.rua, origem.cidade);
    if (!origemCoords || !origemCoords.lat || !origemCoords.lng) {
        if (clienteCriadoAgora) {
            await Cliente.deleteOne({ _id: cliente._id });
        }
        res.status(400).json({ error: 'Endereço de origem inválido ou não encontrado.' });
        return;
    }

    // Verificar se o destino é válido
    const destinoCoords = await geocodeEndereco(destino.rua, destino.cidade);
    if (!destinoCoords || !destinoCoords.lat || !destinoCoords.lng) {
        if (clienteCriadoAgora) {
            await Cliente.deleteOne({ _id: cliente._id });
        }
        res.status(400).json({ error: 'Endereço de destino inválido ou não encontrado.' });
        return;
    }

    try {
        // Criar o pedido
        const novoPedido = new PedidoCliente({
            cliente: cliente._id,
            origem: {
                ...origem,
                lat: origemCoords.lat,
                lng: origemCoords.lng
            },
            destino: {
                ...destino,
                lat: destinoCoords.lat,
                lng: destinoCoords.lng
            },
            nivelConforto,
            numeroPessoas
        });

        await novoPedido.save();
        res.status(201).json(novoPedido);
    } catch (err) {
        if (clienteCriadoAgora) {
            await Cliente.deleteOne({ _id: cliente._id });
        }
        console.error('Erro ao criar o pedido:', err.message);
        res.status(500).json({ error: 'Erro ao criar o pedido. Tente novamente mais tarde.' });
    }
});


exports.listarPedidos = asyncHandler(async (req, res) => {
    const pedidos = await PedidoCliente.find()
        .populate('cliente')
        .sort({ dataPedido: -1 });

    res.status(200).json(pedidos);
});

exports.buscarPedidoNif = asyncHandler(async (req, res) => {

    const { nif } = req.query; // Usar query em vez de body

    if (!nif) {
        return res.status(400).json({ message: 'NIF não fornecido' });
    }

    // Buscar o cliente pelo NIF
    const cliente = await Cliente.findOne({ nif });
    if (!cliente) {
        return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    // Buscar o último pedido do cliente
    const pedido = await PedidoCliente.findOne({ cliente: cliente._id }).sort({ dataPedido: -1 });

    if (!pedido) {
        return res.status(404).json({ message: 'Nenhum pedido encontrado para este cliente' });
    }

    res.status(200).json(pedido); // Retorna um único pedido
});

exports.geocodeCoordenadas = asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ message: 'latitude e longitude são obrigatorios' });
    }

    try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
        const response = await axios.get(url, { headers: { 'User-Agent': 'TaxiSystem/1.0' } });
        if (response.data && response.data.address) {
            const { road, town } = response.data.address;

            res.status(200).json({
                rua: road || 'Rua não encontrada',
                localidade: town || 'Localidade não encontrada',
                codigo_postal: response.data.address.postcode || 'Código postal não encontrado'
            });
        } else {
            res.status(404).json({ error: 'Endereço não encontrado para as coordenadas fornecidas.' });
        }
    } catch (error) {
        console.error('Erro ao geocodificar coordenadas:', error.message);
        res.status(500).json({ error: 'Erro ao processar a solicitação.' });
    }
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