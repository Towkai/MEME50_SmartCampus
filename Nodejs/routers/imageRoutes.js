const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const imageController = require('../SamFacePhoto/controllers/imageController');

router.get('/web_images', imageController.getImages);
router.get('/videoPhoto', imageController.renderVideoPhoto);

router.delete('/clear-images', (req, res) => {
    const dirPath = path.join(__dirname, '../public/web_images');
    fs.readdir(dirPath, (err, files) => {
        if (err) return res.status(500).send('讀取資料夾失敗');
        for (const file of files) {
            fs.unlink(path.join(dirPath, file), err => {
                if (err) console.error(`刪除失敗: ${file}`, err);
            });
        }
        res.send('已刪除');
    });
});

module.exports = router;