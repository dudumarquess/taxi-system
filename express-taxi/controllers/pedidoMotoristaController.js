const PedidoCliente = require('../models/pedidoClienteModel');
const haversine = require('haversine-distance');
const Motorista = require('../models/motoristaModel');
const { calcularCustoViagemFuncao } = require('../controllers/precoController');
const { getTurnoAtualFuncao } = require('../controllers/motoristaController');


// Listar pedidos pendentes para o motorista, ordenados por distância
exports.listarPedidosPendentes = async (req, res) => {
    try {
        const { lat, lng, motoristaId } = req.query;
        const motoristaCoords = {
            lat: parseFloat(lat) || 38.756734,
            lng: parseFloat(lng) || -9.155412,
        };

        const pedidos = await PedidoCliente.find({
            status: 'pendente_motorista',
            'origem.lat': { $exists: true, $ne: null },
            'origem.lng': { $exists: true, $ne: null },
        });
        const turnoAtual = await getTurnoAtualFuncao(motoristaId);
        if (!turnoAtual || !turnoAtual.taxi) {
            return res.status(400).json({ error: 'Nenhum táxi atribuído ao motorista neste momento.' });
        }
        const nivelConfortoTaxi = turnoAtual.taxi.nivel_conforto;

        const pedidosComDistancia = await Promise.all(
            pedidos.map(async (pedido) => {
                if (pedido.nivelConforto !== nivelConfortoTaxi) {
                    return null; // Se o nível de conforto não coincidir, ignora o pedido
                }
                const origemCoords = {
                    lat: pedido.origem.lat,
                    lng: pedido.origem.lng,
                };

                const distancia = haversine(motoristaCoords, origemCoords) / 1000;
                const minutosEstimados = distancia * 4;

                const inicio = new Date(); // agora
                const fim = new Date(inicio.getTime() + minutosEstimados * 60000);

                const preco = await calcularCustoViagemFuncao(
                    pedido.nivelConforto,
                    inicio,
                    fim
                );

                pedido.distancia = parseFloat(distancia.toFixed(2));
                pedido.request.preco = parseFloat(preco);
                await pedido.save();

                return {
                    ...pedido.toObject(),
                    distancia: pedido.distancia,
                    request: {
                        preco: pedido.request.preco,
                    },
                };
            })
        );
        const pedidosComDistanciaFiltrados = pedidosComDistancia.filter(pedido => pedido !== null);
        pedidosComDistanciaFiltrados.sort((a, b) => a.distancia - b.distancia);

        res.json(pedidosComDistancia);
    } catch (err) {
        console.error(err);
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

        const turnoAtual = await getTurnoAtualFuncao(motoristaId);
        if (!turnoAtual || !turnoAtual.taxi) {
            return res.status(400).json({ error: 'Nenhum táxi atribuído ao motorista neste momento.' });
        }

        pedido.status = 'pendente_cliente';
        pedido.motorista = motorista;
        // Log da linha que atribui o taxi ao pedido

        pedido.request.taxi = turnoAtual.taxi;

        await pedido.save();
        res.json({ success: true, pedido });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao aceitar pedido.' });
    }
};

