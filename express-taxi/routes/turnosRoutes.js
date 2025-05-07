const express = require('express');
const router = express.Router();
const controller = require('../controllers/turnoController');

router.get('/', controller.listarTurnos)

router.post('/verificar-intersecoes', controller.verificarIntersecoes);

router.post('/requisitar-turno', controller.turno_post);

module.exports = router;