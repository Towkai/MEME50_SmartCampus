const express = require('express');
const router = express.Router();
const feedController = require('../Feeder/Controllers/feedController');

router.get('/', feedController.showFeedLog);

module.exports = router;
