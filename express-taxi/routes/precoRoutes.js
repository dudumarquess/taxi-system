const express = require('express');
const router = express.Router();
const precoController = require('../controllers/precoController');

router.post('/definir', precoController.definirPreco);
router.get('/', precoController.listarPrecos);
router.post('/calcular_custo', precoController.calcularCustoViagem);

module.exports = router;