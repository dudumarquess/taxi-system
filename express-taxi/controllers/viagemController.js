const Viagem = require('../models/viagemModel');
const PedidoCliente = require('../models/pedidoClienteModel');
const Turno = require('../models/turnoModel');
const Motorista = require('../models/motoristaModel');
const asyncHandler = require('express-async-handler');

exports.iniciarViagem = asyncHandler(async (req, res) => {
    const { pedidoId, turnoId, motoristaId } = req.body;

    // Buscar o pedido pelo ID
    const pedido = await PedidoCliente.findById(pedidoId);
    if (!pedido || pedido.status !== 'aceito_pelo_cliente') {
        return res.status(400).json({ error: 'Pedido inválido ou não está no estado aceito pelo cliente.' });
    }

    // Buscar o turno pelo ID
    const turno = await Turno.findById(turnoId);
    if (!turno) {
        return res.status(404).json({ error: 'Turno não encontrado.' });
    }

    // Buscar o motorista pelo ID
    const motorista = await Motorista.findById(motoristaId);
    if (!motorista) {
        return res.status(404).json({ error: 'Motorista não encontrado.' });
    }

    // Determinar o número de sequência da viagem no turno
    const ultimaViagem = await Viagem.findOne({ turno: turnoId }).sort({ numeroSequencia: -1 });
    const numeroSequencia = ultimaViagem ? ultimaViagem.numeroSequencia + 1 : 1;

    // Criar a nova viagem
    const viagem = new Viagem({
        motorista: motoristaId,
        pedidoCliente: pedidoId,
        turno: turnoId,
        numeroSequencia,
        numeroPessoas: pedido.numeroPessoas,
        inicio: {
            data: new Date(),
            morada: {
                rua: pedido.origem.rua,
                cidade: pedido.origem.cidade,
                lat: pedido.origem.lat,
                lng: pedido.origem.lng
            }
        },
    });

    await viagem.save();
    await PedidoCliente.findByIdAndUpdate(pedidoId, { status: 'em_viagem' });

    res.status(201).json({ success: true, message: 'Viagem iniciada com sucesso.', viagem });
});

exports.finalizarViagem = asyncHandler(async (req, res) => {
    const { id } = req.params; // ID da viagem
    const { morada } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'ID da viagem não fornecido.' });
    }

    const viagem = await Viagem.findById(id).populate('pedidoCliente');
    if (!viagem) {
        return res.status(404).json({ error: 'Viagem não encontrada.' });
    }

    // Atualizar os dados de fim da viagem
    viagem.fim = {
        data: new Date(),
        morada: {
            rua: morada.rua,
            cidade: morada.cidade,
            lat: morada.lat,
            lng: morada.lng
        }
    };

    // Calcular quilômetros e valor
    viagem.quilometros = await viagem.calcularQuilometros();
    viagem.valorTotal = await viagem.calcularPreco();

    await viagem.save();
    await PedidoCliente.findByIdAndUpdate(viagem.pedidoCliente._id, { status: 'concluído' });

    res.json({ success: true, message: 'Viagem finalizada com sucesso.', viagem });
});

exports.listarViagens = asyncHandler(async (req, res) => {
    const { motoristaId } = req.params;

    // Buscar viagens concluídas (com horário de fim definido) e associadas ao motorista
    const viagens = await Viagem.find({
        motorista: motoristaId, // Filtrar pelo motorista
        'fim.data': { $exists: true, $ne: null } // Apenas viagens concluídas
    })
        .populate('pedidoCliente') // Popula os dados do pedido
        .populate('turno') // Popula os dados do turno
        .sort({ 'fim.data': -1 }); // Ordenar por data de fim (mais recente primeiro)

    res.json(viagens);
});

exports.getViagemPorPedido = asyncHandler(async (req, res) => {
    const { pedidoId } = req.params;

    console.log(`Buscando viagem para o pedidoId: ${pedidoId}`);
    const viagem = await Viagem.findOne({ pedidoCliente: pedidoId});

    if (!viagem) {
        console.warn(`Nenhuma viagem encontrada para o pedidoId: ${pedidoId}`);
        return res.status(404).json({ message: 'Nenhuma viagem encontrada para este pedido' });
    }

    console.log('Viagem encontrada:', viagem);
    res.json(viagem);
});