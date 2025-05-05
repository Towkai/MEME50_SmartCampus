const fs = require('fs');

exports.showFeedLog = (req, res) => {
    fs.readFile('./public/feeder/feed_log_server.csv', 'utf8', (err, data) => {
        if (err) {
            return res.send('開啟檔案失敗, ' + err);
        }
        const records = data.trim().split('\n').map(line => line.split(','));
        res.render('feeder/index', { records });
    });
};
