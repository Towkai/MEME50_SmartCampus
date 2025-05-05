const express = require('express');
const router = express.Router();
const feedController = require('../Parking/controllers/parkingController');

router.get('/', feedController.Parking);

module.exports = router;
