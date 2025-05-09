const express = require('express');
const router = express.Router();
const controller = require('../controllers/motoristaController');

router.post('/', controller.registarMotorista);
router.get('/', controller.listarMotoristas);
router.post('/login', controller.loginMotorista);

router.get('/:motoristaId/pedido-atual', motoristaController.getPedidoAtual);
router.get('/:motoristaId/turno-atual', motoristaController.getTurnoAtual);

module.exports = router;