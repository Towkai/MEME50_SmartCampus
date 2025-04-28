const express = require('express');
const router = express.Router();
const controller = require('./Dashboard/controllers/main_controller');

router.use((req,res,next)=>{
    res.setHeader('Content-Type','text/html; charset=UTF-8');
    next();
});
router.get('/', controller.index);
router.get('/parking', controller.Parking);

module.exports = router;