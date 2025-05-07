const express = require('express');
const router = express.Router();
const controller = require('../controllers/turnoController');

router.get('/', controller.listarTurnos)

router.post('/verificar-intersecoes', controller.verificarIntersecoes);


module.exports = router;