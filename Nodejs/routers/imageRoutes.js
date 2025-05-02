const express = require('express');
const router = express.Router();
const imageController = require('../SamFacePhoto/controllers/imageController');

router.get('/web_images', imageController.getImages);
router.get('/videoPhoto', imageController.renderVideoPhoto);

module.exports = router;