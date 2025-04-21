const express = require('express');
const router = express.Router();
const controller = require('../controllers/taxiController');

router.post('/', controller.taxi_post);
router.get('/', controller.taxi_get_all)

module.exports = router;
