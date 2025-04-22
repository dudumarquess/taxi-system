const express = require('express');
const router = express.Router();
const controller = require('../controllers/taxiController');

router.post('/', controller.taxi_post);
router.get('/', controller.taxi_get_all)
router.delete('/:id', controller.taxi_delete)

module.exports = router;
