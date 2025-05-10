const PedidoCliente = require('../models/pedidoClienteModel');
const haversine = require('haversine-distance');

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
        const pedidosComDistancia = pedidos.map(pedido => {
        const origemCoords = {
            lat: pedido.origem.lat,
            lng: pedido.origem.lng
        };
        const distancia = haversine(motoristaCoords, origemCoords) / 1000; // km
        return { ...pedido.toObject(), distancia };
        });
        // Ordena por distância
        pedidosComDistancia.sort((a, b) => a.distancia - b.distancia);

        console.log('Pedidos encontrados:', pedidos); // Debugging
        console.log('Pedidos com distância:', pedidosComDistancia); // Debugging
        res.json(pedidosComDistancia);
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
    await pedido.save();
    res.json({ success: true, pedido });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao aceitar pedido.' });
  }
};
