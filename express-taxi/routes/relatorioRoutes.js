const express = require('express');
const controller = require('../controllers/relatorioController');
const router = express.Router({ mergeParams: true });


router.get('/estatisticasMotorista', controller.estatisticaInicialMotorista);
router.get('/estatisticasTaxi', controller.estatisticaInicialTaxi);

router.get('/subtotais-horas-motorista', controller.subtotaisHorasPorMotoristaNoTaxi);
router.get('/subtotais-viagens-motorista', controller.subtotaisViagensPorMotoristaNoTaxi);
router.get('/subtotais-km-motorista', controller.subtotaisKmPorMotoristaNoTaxi);


module.exports = router;