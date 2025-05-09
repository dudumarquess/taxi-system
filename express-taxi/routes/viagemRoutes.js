const express = require('express');
const router = express.Router();
const controller = require('../controllers/viagemController');

router.post('/iniciar', controller.iniciarViagem);
router.post('/finalizar/:id', controller.finalizarViagem);
router.get('/motorista/:motoristaId', controller.listarViagens);

module.exports = router;