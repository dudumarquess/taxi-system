const Viagem = require('../models/viagemModel');
const PedidoCliente = require('../models/pedidoClienteModel');
const Turno = require('../models/turnoModel');
const asyncHandler = require('express-async-handler');

exports.iniciarViagem = asyncHandler(async (req, res) => {
    const { pedidoId, turnoId } = req.body;

    const pedido = await PedidoCliente.findById(pedidoId);
    if (!pedido || pedido.status !== 'aceito_pelo_cliente') {
        return res.status(400).json({ error: 'Pedido inválido' });
    }

    const turno = await Turno.findById(turnoId);
    if (!turno) {
        return res.status(404).json({ error: 'Turno não encontrado' });
    }

    const ultimaViagem = await Viagem.findOne({ turno: turnoId }).sort({ numeroSequencia: -1 });
    const numeroSequencia = ultimaViagem ? ultimaViagem.numeroSequencia + 1 : 1;

    const viagem = new Viagem({
        pedidoCliente: pedidoId,
        turno: turnoId,
        numeroSequencia,
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
        .populate({
            path: 'pedidoCliente',
            match: { 
                status: { 
                    $in: ['aceito_pelo_cliente', 'em_viagem', 'concluído'] 
                }
            }
        })
        .populate('turno')
        .sort({ 'inicio.data': -1 });

    const viagensFiltradas = viagens.filter(viagem => viagem.pedidoCliente !== null);

    res.json(viagensFiltradas);
});