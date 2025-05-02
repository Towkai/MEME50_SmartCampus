const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

router.get('/api/images', imageController.getImages);
router.get('/videoPhoto', imageController.renderVideoPhoto);

module.exports = router;