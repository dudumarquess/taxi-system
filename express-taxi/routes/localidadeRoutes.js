const express = require('express');
const router = express.Router();
const controller = require('../controllers/localidadeController');

router.get('/:codigoPostal', controller.getLocalidade);


module.exports = router;