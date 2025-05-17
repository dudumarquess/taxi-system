const express = require('express');
const router = express.Router();
const controller = require('../controllers/taxiController');

router.post('/', controller.taxi_post);
router.get('/', controller.taxi_get_all)
router.delete('/:id', controller.taxi_delete)
router.post('/disponiveis', controller.taxi_disponiveis_post)
router.put('/:id', controller.taxi_edit)
router.get('/:id', controller.taxi_getById)
module.exports = router;
