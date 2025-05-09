const Viagem = require('../models/viagemModel');
const PedidoCliente = require('../models/pedidoClienteModel');
const asyncHandler = require('express-async-handler');

exports.iniciarViagem = asyncHandler(async (req, res) => {
    const { pedidoId, turnoId } = req.body;

    const pedido = await PedidoCliente.findById(pedidoId);
    if (!pedido || pedido.status !== 'aceito_pelo_cliente') {
        return res.status(400).json({ error: 'Pedido inválido' });
    }

    const viagem = new Viagem({
        pedidoCliente: pedidoId,
        turno: turnoId,
        numeroPessoas: pedido.numeroPessoas,
        inicio: {
            data: new Date()
        }
    });

    await viagem.save();
    await PedidoCliente.findByIdAndUpdate(pedidoId, { status: 'em_viagem' });

    res.status(201).json(viagem);
});

exports.finalizarViagem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { morada } = req.body;

    const viagem = await Viagem.findById(id).populate('pedidoCliente');
    if (!viagem) {
        return res.status(404).json({ error: 'Viagem não encontrada' });
    }

    viagem.fim = {
        data: new Date(),
        morada: morada
    };

    // Calcular quilômetros e valor
    viagem.quilometros = await viagem.calcularQuilometros();
    viagem.valorTotal = await viagem.calcularPreco();

    await viagem.save();
    await PedidoCliente.findByIdAndUpdate(viagem.pedidoCliente._id, { status: 'concluído' });

    res.json(viagem);
});

exports.listarViagens = asyncHandler(async (req, res) => {
    const { motoristaId } = req.params;
    
    const viagens = await Viagem.find({})
        .populate('pedidoCliente')
        .populate('turno')
        .sort({ 'inicio.data': -1 }); // Ordenar por data mais recente

    res.json(viagens);
});