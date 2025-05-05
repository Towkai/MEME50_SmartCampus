const express = require('express');
const router = express.Router();
const parkingController = require('../Parking/controllers/parkingController');

router.get('/', parkingController.Parking);

module.exports = router;
