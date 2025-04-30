const express = require('express');
const router = express.Router();
const sdrs_controller = require('../SmartDrivingRecordSystem/controllers/sdrs_controller');

router.get('/getFiles', sdrs_controller.getFiles);
router.get('/checkFile', sdrs_controller.checkFile);
router.delete('/delFile/:file', sdrs_controller.delFile);

module.exports = router;
