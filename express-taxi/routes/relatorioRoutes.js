const express = require('express');
const controller = require('../controllers/relatorioController');
const router = express.Router({ mergeParams: true });


router.get('/estatisticasMotorista', controller.estatisticaInicialMotorista);
router.get('/estatisticasTaxi', controller.estatisticaInicialTaxi);


module.exports = router;