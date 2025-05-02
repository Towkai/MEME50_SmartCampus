const fs = require('fs');
const path = require('path');

const IMAGE_DIR = path.join(__dirname, '../public/web_images');

exports.getAllImages = (callback) => {
    fs.readdir(IMAGE_DIR, (err, files) => {
        if (err) return callback(err);

        const imageFiles = files
            .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))
            .map(file => ({
                name: file,
                time: fs.statSync(path.join(IMAGE_DIR, file)).mtime.getTime()
            }))
            .sort((a, b) => b.time - a.time) // 最新的排最前面
            .map(file => file.name); // 最後只回傳檔名

        callback(null, imageFiles);
    });
};