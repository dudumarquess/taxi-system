const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidoClienteController');

router.post('/', controller.criarPedido);
router.get('/', controller.listarPedidos);
router.post('/geocode', controller.geocodeCoordenadas)
router.get('/buscar', controller.buscarPedidoNif);
module.exports = router;