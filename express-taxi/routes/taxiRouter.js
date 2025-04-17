const express = require('express');
const router = express.Router();
const controller = require('../controllers/taxiController');

router.post('/taxis', controller.taxi_post);
router.get('/taxis', controller.taxi_get_all)

module.exports = router;
