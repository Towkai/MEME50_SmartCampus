const express = require('express');
const router = express.Router();
const temperatureController = require('../NicoleFoodSystem/controllers/temperatureController');

router.use((req,res,next)=>{
    res.setHeader('Content-Type','text/html; charset=UTF-8');
    next();
});
router.get('/', temperatureController.getTemperatureData);


module.exports = router;