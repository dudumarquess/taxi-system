const express = require('express');
const router = express.Router();
const controller = require('../controllers/motoristaController');

router.post('/', controller.registarMotorista);
router.get('/', controller.listarMotoristas);
router.post('/login', controller.loginMotorista);

module.exports = router;