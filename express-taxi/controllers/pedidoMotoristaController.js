const PedidoCliente = require('../models/pedidoClienteModel');
const haversine = require('haversine-distance');
const Motorista = require('../models/motoristaModel');
const { calcularCustoViagemFuncao } = require('../controllers/precoController');
const { getTurnoAtualFuncao } = require('../controllers/motoristaController');


// Listar pedidos pendentes para o motorista, ordenados por distância
exports.listarPedidosPendentes = async (req, res) => {
    try {
        const { lat, lng } = req.query;
        const motoristaCoords = {
            lat: parseFloat(lat) || 38.756734,
            lng: parseFloat(lng) || -9.155412
        };

        // Busca pedidos com status pendente_motorista e que tenham lat/lng na origem
        const pedidos = await PedidoCliente.find({
            status: 'pendente_motorista',
            'origem.lat': { $exists: true, $ne: null },
            'origem.lng': { $exists: true, $ne: null }
        });

        // Calcula a distância para cada pedido
        const pedidosComDistancia = pedidos.map(async (pedido) => {
            const origemCoords = {
                lat: pedido.origem.lat,
                lng: pedido.origem.lng
            };
            const distancia = haversine(motoristaCoords, origemCoords) / 1000; // km
            const preco = calcularCustoViagemFuncao(pedido.nivelConforto, pedido.origem, pedido.destino);
            pedido.distancia = parseFloat(distancia.toFixed(2));
            pedido.request.preco = parseFloat(preco);

            // Salva as alterações no banco de dados
            await pedido.save(); // Persiste as alterações de distancia e preco no banco

            return pedido.toObject(); // Retorna o objeto modificado
        });

        // Aguarda todos os pedidos serem atualizados
        const pedidosAtualizados = await Promise.all(pedidosComDistancia);

        // Ordena por distância
        pedidosAtualizados.sort((a, b) => a.distancia - b.distancia);

        console.log('Pedidos encontrados:', pedidos); // Debugging
        console.log('Pedidos com distância:', pedidosAtualizados); // Debugging
        res.json(pedidosAtualizados);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar pedidos pendentes.' });
    }
};

// Motorista aceita um pedido
exports.aceitarPedido = async (req, res) => {
    try {
        const { pedidoId, motoristaId } = req.body;
        const pedido = await PedidoCliente.findById(pedidoId);
        if (!pedido || pedido.status !== 'pendente_motorista') {
            return res.status(400).json({ error: 'Pedido não disponível.' });
        }
        const motorista = await Motorista.findById(motoristaId);
        if (!motorista) {
            return res.status(404).json({ error: 'Motorista não encontrado.' });
        }
        pedido.status = 'pendente_cliente'; // Aguarda confirmação do cliente
        pedido.motorista = motorista;
        pedido.request.taxi = getTurnoAtualFuncao(motoristaId).taxi;
        await pedido.save();
        res.json({ success: true, pedido });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao aceitar pedido.' });
    }
};

