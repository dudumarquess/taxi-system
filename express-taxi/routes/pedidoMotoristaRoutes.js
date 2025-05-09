const express = require('express');
const router = express.Router();
const controller = require('../controllers/pedidoMotoristaController');

router.get('/', controller.listarPedidosPendentes);
router.post('/aceitar', controller.aceitarPedido);

module.exports = router;