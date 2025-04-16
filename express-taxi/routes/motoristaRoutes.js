const express = require('express');
const router = express.Router();
const controller = require('../controllers/motoristaController');

router.post('/novo', controller.registarMotorista);
router.get('/', controller.listarMotoristas);

module.exports = router;