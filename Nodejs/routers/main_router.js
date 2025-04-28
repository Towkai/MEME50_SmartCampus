const express = require('express');
const router = express.Router();
const controller = require('../Dashboard/controllers/main_controller');

router.get('/', controller.index);

module.exports = router;