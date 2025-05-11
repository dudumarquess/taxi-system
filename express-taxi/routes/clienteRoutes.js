const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');


router.get('/', clienteController.listarClientes);
router.post('/login', clienteController.buscarOuCriarCliente);

module.exports = router;