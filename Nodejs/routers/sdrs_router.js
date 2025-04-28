const express = require('express');
const router = express.Router();
const sdrs_controller = require('../SmartDrivingRecordSystem/controllers/sdrs_controller');

router.get('/getFiles', sdrs_controller.getFiles);

module.exports = router;
