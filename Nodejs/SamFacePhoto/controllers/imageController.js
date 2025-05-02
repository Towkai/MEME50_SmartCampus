const imageModel = require('../models/imageModel');
const path = require('path');

exports.getImages = (req, res) => {
    imageModel.getAllImages((err, imageFiles) => {
        if (err) return res.status(500).send('Error reading images');
        res.json(imageFiles);
    });
};

exports.renderVideoPhoto = (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/videoPhoto.html'));
};
