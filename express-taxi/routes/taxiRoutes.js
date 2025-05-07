const express = require('express');
const router = express.Router();
const controller = require('../controllers/taxiController');

router.post('/', controller.taxi_post);
router.get('/', controller.taxi_get_all)
router.delete('/:id', controller.taxi_delete)
router.post('/disponiveis', controller.taxi_disponiveis_post)

module.exports = router;
