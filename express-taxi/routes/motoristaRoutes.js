const express = require('express');
const router = express.Router();
const controller = require('../controllers/motoristaController');

router.post('/', controller.registarMotorista);
router.get('/', controller.listarMotoristas);
router.post('/login', controller.loginMotorista);

router.get('/:motoristaId/pedido-atual', controller.getPedidoAtual);
router.get('/:motoristaId/turno-atual', controller.getTurnoAtual);
router.delete('/:id', controller.motorista_delete);
router.put('/:id', controller.motorista_edit);
router.get('/:id', controller.motorista_getById)

module.exports = router;