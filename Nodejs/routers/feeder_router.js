const express = require('express');
const router = express.Router();
const feedController = require('../feeder/controllers/feedController');

router.get('/', feedController.showFeedLog);

module.exports = router;
