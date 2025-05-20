const express = require('express');
const controller = require('../controllers/relatorioController');
const router = express.Router({ mergeParams: true });


router.get('/estatisticas', controller.estatisticaInicialMotorista);
router.get('/estatisicas', controller.estatisticaInicialTaxi);


module.exports = router;