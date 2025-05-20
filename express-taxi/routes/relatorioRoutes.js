const express = require('express');
const controller = require('../controllers/relatorioController');
const router = express.Router({ mergeParams: true }); // <-- ESSENCIAL


router.get('/estatisticasMotorista', controller.estatisticaInicialMotorista);
router.get('/estatisicasTaxi', controller.estatisticaInicialTaxi);


module.exports = router;