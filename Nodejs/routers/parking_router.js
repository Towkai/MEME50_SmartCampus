const express = require('express');
const router = express.Router();
const feedController = require('../Parking/controllers/parkingController');

router.get('/parking', feedController.Parking);

module.exports = router;
