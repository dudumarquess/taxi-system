const express = require('express');
const controller = require('../controllers/relatorioController');
const router = express.Router({ mergeParams: true });


router.get('/estatisticasMotorista', controller.estatisticaInicialMotorista);
router.get('/estatisticasTaxi', controller.estatisticaInicialTaxi);

router.get('/subtotais-horas-motorista', controller.subtotaisHorasPorMotoristaNoTaxi);
router.get('/subtotais-horas-taxi', controller.subtotaisHorasPorTaxiDoMotorista);

router.get('/subtotais-viagens-taxi', controller.subtotaisViagensPorTaxiDoMotorista);
router.get('/subtotais-km-taxi', controller.subtotaisKmPorTaxiDoMotorista);

module.exports = router;