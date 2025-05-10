const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidoClienteController');

router.post('/', controller.criarPedido);
router.get('/', controller.listarPedidos);
router.post('/geocode', controller.geocodeCoordenadas)
router.get('/buscar', controller.buscarPedidoNif);
router.post('/aceitar', controller.aceitarPedido);
router.post('/recusar', controller.recusarPedido);
router.post('/cancelar', controller.cancelarPedido);
module.exports = router;